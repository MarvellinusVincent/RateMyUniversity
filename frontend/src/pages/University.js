import { useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../contexts/UseClickOutside';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { jwtDecode } from 'jwt-decode';

const University = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [sortOption, setSortOption] = useState('recent');
  const [averageRatings, setAverageRatings] = useState({
    overall: 0,
    safety: 0,
    social: 0,
    clubs: 0,
    facilities: 0,
    athletics: 0,
    academic: 0,
    professors: 0,
    difficulty: 0,
    opportunities: 0,
    internet: 0,
    location: 0,
    housing: 0,
    food: 0,
    transportation: 0,
    happiness: 0,
  });

  const universityName = new URLSearchParams(location.search).get('name');

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const response = await fetch(`http://localhost:1234/specificUni?name=${universityName}`);
        const universityData = await response.json();
        setUniversity(universityData);

        if (universityData.id) {
          const reviewsResponse = await fetch(`http://localhost:1234/specificUni/${universityData.id}/reviews`);
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);

          // Fetch usernames
          const users = {};
          if (reviewsData.reviews) {
            for (let review of reviewsData.reviews) {
              if (review.user_id) {
                try {
                  const userResponse = await fetch(`http://localhost:1234/users/getUser?userID=${review.user_id}`);
                  const userData = await userResponse.json();
                  users[review.user_id] = userData.username;
                } catch (error) {
                  console.error('Error fetching user:', error);
                  users[review.user_id] = "Anonymous";
                }
              } else {
                users[review.id] = "Anonymous";
              }
            }
          }
          setUsernames(users);

          const defaultRatings = {
            overall: 0,
            facilities: 0,
            happiness: 0,
            social: 0,
            opportunities: 0,
            difficulty: 0,
            clubs: 0,
            location: 0,
            internet: 0,
            safety: 0,
            food: 0,
            academic: 0,
            transportation: 0,
            professors: 0,
            athletics: 0,
            housing: 0
          };

          if (reviewsData.reviews && reviewsData.reviews.length > 0) {
            const totals = reviewsData.reviews.reduce((acc, review) => {
              return {
                overall: acc.overall + (review.overall_rating || 0),
                facilities: acc.facilities + (review.facilities_rating || 0),
                happiness: acc.happiness + (review.happiness_rating || 0),
                social: acc.social + (review.social_life_rating || 0),
                opportunities: acc.opportunities + (review.opportunities_rating || 0),
                difficulty: acc.difficulty + (review.difficulty_rating || 0),
                clubs: acc.clubs + (review.clubs_rating || 0),
                location: acc.location + (review.location_rating || 0),
                internet: acc.internet + (review.internet_rating || 0),
                safety: acc.safety + (review.safety_rating || 0),
                food: acc.food + (review.food_rating || 0),
                academic: acc.academic + (review.academic_rating || 0),
                transportation: acc.transportation + (review.transportation_rating || 0),
                professors: acc.professors + (review.professors_rating || 0),
                athletics: acc.athletics + (review.athletics_rating || 0),
                housing: acc.housing + (review.housing_rating || 0)
              };
            }, defaultRatings);

            const averages = {};
            for (const key in totals) {
              averages[key] = parseFloat((totals[key] / reviewsData.reviews.length).toFixed(1));
            }
            setAverageRatings(averages);
          } else {
            setAverageRatings(defaultRatings);
          }
        }
      } catch (error) {
        console.error('Error loading university details:', error);
      }
    };

    if (universityName) {
      fetchUniversityDetails();
    }
  }, [universityName]);

  const handleRateClick = () => {
    navigate(`/leaveReview?id=${university.id}&name=${university.name}`);
  };

  const handleLikeReview = async (reviewId) => {
    const { token, refresh } = useAuthStore.getState();
    
    if (!token) {
      console.log("No token - user needs to log in");
      return { needsLogin: true };
    }
  
    try {
      const decoded = jwtDecode(token);
      let currentToken = token;
      
      if (decoded.exp * 1000 < Date.now()) {
        currentToken = await refresh();
      }
  
      const response = await fetch(`http://localhost:1234/reviews/${reviewId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to like review');
      }
  
      const data = await response.json();
      setReviews(reviews.map(review =>
        review.id === reviewId
          ? { ...review, likes: data.likes }
          : review
      ));
      return { success: true };
    } catch (error) {
      console.error("Error liking review:", error);
      setReviews(reviews.map(review =>
        review.id === reviewId
          ? { ...review, likes: Math.max(0, (review.likes || 0) - 1 )}
          : review
      ));
      return { error: true };
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return (b.likes || 0) - (a.likes || 0);
    }
  });

  const getTopRatedCategories = () => {
    const { overall, ...categories } = averageRatings;
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key, value]) => ({
        key,
        label: {
          happiness: "Happiness",
          academic: "Academics",
          safety: "Safety",
          social: "Social",
          facilities: "Facilities",
          professors: "Professors",
          clubs: "Clubs",
          location: "Location",
          food: "Food",
          housing: "Housing",
          transportation: "Transport",
          athletics: "Athletics",
          internet: "Internet",
          opportunities: "Opportunities",
          difficulty: "Difficulty"
        }[key],
        value,
        icon: {
          happiness: "🌞",
          academic: "📚",
          safety: "👮‍♂️",
          social: "🎉",
          facilities: "🏛️",
          professors: "👨‍🏫",
          clubs: "🎭",
          location: "📍",
          food: "🍕",
          housing: "🏠",
          transportation: "🚌",
          athletics: "🏈",
          internet: "🌐",
          opportunities: "💼",
          difficulty: "🧠"
        }[key]
      }));
  };

  const LikeButton = ({ review, onLike }) => {
    const { isAuthenticated } = useAuth();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const promptRef = useRef(null);
    
    useClickOutside(promptRef, () => {
      setShowLoginPrompt(false);
    });
  
    const handleClick = async () => {
      if (!isAuthenticated) {
        setShowLoginPrompt(true);
        return;
      }
  
      setIsLiking(true);
      try {
        const result = await onLike(review.id);
        if (result?.needsLogin) {
          setShowLoginPrompt(true);
        }
      } finally {
        setIsLiking(false);
      }
    };
  
    return (
      <div className="relative" ref={promptRef}>
        <button
          onClick={handleClick}
          disabled={isLiking}
          className={`flex items-center transition-colors ${
            review.isLiked 
              ? 'text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          } ${isLiking ? 'opacity-50' : ''}`}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill={review.isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={review.isLiked ? "2" : "1.5"}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm font-medium">{review.likes || 0}</span>
        </button>
  
        {showLoginPrompt && (
          <div className="absolute z-10 w-64 p-3 mt-2 -left-32 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Please log in</p>
                <p className="mt-1 text-sm text-gray-500">You need to be logged in to like reviews</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-6">
            404
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">University not found</h1>
          <p className="text-xl text-gray-300">The university you're looking for doesn't exist in our database</p>
        </div>
      </div>
    );
  }

  const topCategories = getTopRatedCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative py-16 px-6 sm:px-12 lg:px-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          {university.name}
        </h1>
        <div className="inline-flex items-center backdrop-blur-sm px-6 py-3">
          <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">{university.country}</span>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <a
            href={`https://www.ratemyprofessors.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            title="Rate professors on RateMyProfessors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Rate Professors
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`https://www.ratemycourses.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-green-500 flex items-center gap-1"
            title="Rate courses on RateMyProfessors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Rate Courses
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        {/* Overall Rating */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden mb-16 border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Rating Circle */}
              <div className="lg:w-1/3 flex flex-col items-center mb-10 lg:mb-0 relative">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-pink-100 animate-pulse opacity-30"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
                    <span className="text-5xl font-bold text-white">{averageRatings.overall.toFixed(1)}</span>
                  </div>
                  <div className="absolute -inset-2 rounded-full border-4 border-blue-200/50 animate-spin-slow opacity-70"></div>
                </div>
                <div className="mt-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall Rating</h2>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < Math.round(averageRatings.overall)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="lg:w-2/3 lg:pl-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">Best-Rated Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {topCategories.map((category, index) => (
                    <div 
                      key={index}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <span className="text-4xl mr-4">{category.icon}</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-1">{category.label}</h4>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-teal-400" 
                                style={{ width: `${(category.value / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-bold text-gray-700">{category.value.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <CategoryCard 
            title="Campus Life"
            icon="🏛️"
            ratings={[
              { label: "Safety", value: averageRatings.safety },
              { label: "Social Life", value: averageRatings.social },
              { label: "Clubs", value: averageRatings.clubs },
              { label: "Facilities", value: averageRatings.facilities },
              { label: "Athletics", value: averageRatings.athletics }
            ]}
            colorFrom="from-blue-400"
            colorTo="to-indigo-500"
          />
          
          <CategoryCard 
            title="Academics"
            icon="📚"
            ratings={[
              { label: "Academics", value: averageRatings.academic },
              { label: "Professors", value: averageRatings.professors },
              { label: "Difficulty", value: averageRatings.difficulty },
              { label: "Opportunities", value: averageRatings.opportunities },
              { label: "Internet", value: averageRatings.internet }
            ]}
            colorFrom="from-teal-400"
            colorTo="to-emerald-500"
          />
          
          <CategoryCard 
            title="Living"
            icon="🏠"
            ratings={[
              { label: "Location", value: averageRatings.location },
              { label: "Housing", value: averageRatings.housing },
              { label: "Food", value: averageRatings.food },
              { label: "Transportation", value: averageRatings.transportation },
              { label: "Happiness", value: averageRatings.happiness },
            ]}
            colorFrom="from-amber-400"
            colorTo="to-orange-500"
          />
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-3xl font-bold text-gray-800">Student Reviews</h3>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSortOption('recent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortOption === 'recent' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortOption('popular')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortOption === 'popular' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Most Liked
              </button>
            </div>
          </div>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedReviews.map((review, index) => {
                const username = usernames[review.user_id] || "Anonymous";
                const reviewDate = review.created_at ? new Date(review.created_at) : null;
                const formattedDate = reviewDate ? reviewDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : "No date";
                
                // All possible rating categories
                const ratingCategories = [
                  { label: "Academics", value: review.academic_rating, color: "green" },
                  { label: "Professors", value: review.professors_rating, color: "green" },
                  { label: "Difficulty", value: review.difficulty_rating, color: "green" },
                  { label: "Opportunities", value: review.opportunities_rating, color: "green" },
                  { label: "Social Life", value: review.social_life_rating, color: "purple" },
                  { label: "Clubs", value: review.clubs_rating, color: "purple" },
                  { label: "Athletics", value: review.athletics_rating, color: "purple" },
                  { label: "Happiness", value: review.happiness_rating, color: "purple" },
                  { label: "Facilities", value: review.facilities_rating, color: "blue" },
                  { label: "Internet", value: review.internet_rating, color: "blue" },
                  { label: "Location", value: review.location_rating, color: "blue" },
                  { label: "Housing", value: review.housing_rating, color: "blue" },
                  { label: "Food", value: review.food_rating, color: "amber" },
                  { label: "Safety", value: review.safety_rating, color: "amber" },
                  { label: "Transportation", value: review.transportation_rating, color: "amber" }
                ].filter(category => category.value !== undefined);

                return (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow duration-200">
                    {/* Header with rating and date */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-2xl font-bold text-gray-900 mr-3">
                            {review.overall_rating?.toFixed(1) || "N/A"}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                filled={i < Math.round(review.overall_rating || 0)} 
                                className="w-5 h-5 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">by {username}</span>
                      </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-400">{formattedDate}</span>
                        </div>
                    </div>

                    {/* Review Text */}
                    {review.review_text && (
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        {review.review_text}
                      </p>
                    )}

                    {/* All Rating Categories */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {ratingCategories.map((category, idx) => (
                        <RatingPill 
                          key={idx} 
                          label={category.label} 
                          value={category.value} 
                          color={category.color} 
                        />
                      ))}
                    </div>

                    {/* Like Button */}
                    <div className="flex items-center mt-4">
                    <LikeButton 
                        review={review} 
                        onLike={handleLikeReview}
                      />
                    </div>

                    {/* Optional Comments */}
                    {review.comments && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-gray-500 italic">"{review.comments}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent pt-10 pb-6 px-6 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-4 sm:p-5">
              <button
                onClick={handleRateClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Rate This University
              </button>
              
              <a
                href={university.web_pages[0]?.replace(/^['"]+|['"]+$/g, '')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white border-2 border-gray-200/70 hover:border-blue-400 text-gray-800 hover:text-blue-600 py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
                Visit Website
              </a>
            </div>
          </div>
        </div>
      
      </main>
    </div>
  );  
};

// Category Card Component
const CategoryCard = ({ title, icon, ratings, colorFrom, colorTo }) => (
  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="p-6">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-4">{icon}</span>
        <h3 className={`text-2xl font-bold bg-gradient-to-r ${colorFrom} ${colorTo} bg-clip-text text-transparent`}>
          {title}
        </h3>
      </div>
      <div className="space-y-5">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{rating.label}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo}`} 
                  style={{ width: `${(rating.value / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-900 font-bold w-8 text-right">{rating.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Rating Pill Component
const RatingPill = ({ label, value, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200"
  };
  
  return (
    <div className={`flex flex-col p-2 rounded-lg border ${colorClasses[color]}`}>
      <span className="text-xs font-medium truncate">{label}</span>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-bold">{value.toFixed(1)}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              filled={i < Math.round(value)} 
              className="w-3 h-3"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Star Icon Component
const StarIcon = ({ filled, small = false }) => (
  <svg 
    className={`${small ? 'w-4 h-4' : 'w-5 h-5'} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

export default University;