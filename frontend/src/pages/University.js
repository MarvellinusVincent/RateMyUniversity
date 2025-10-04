import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import useClickOutside from '../contexts/UseClickOutside';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../stores/authStore';

const University = () => {
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [showNotFound, setShowNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const REVIEWS_PER_PAGE = 20;
  
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareSearchTerm, setCompareSearchTerm] = useState('');
  const [compareSearchResults, setCompareSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const compareModalRef = useRef(null);
  
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

  const { id } = useParams();

  // Close compare modal when clicking outside
  useClickOutside(compareModalRef, () => {
    if (showCompareModal) {
      setShowCompareModal(false);
      setCompareSearchTerm('');
      setCompareSearchResults([]);
    }
  });

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      setIsLoading(true);
      setShowNotFound(false);
      
      try {
        const [universityResponse, reviewsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/specificUni/${id}`),
          fetch(`${process.env.REACT_APP_API_URL}/specificUni/${id}/reviews?page=${currentPage}&limit=${REVIEWS_PER_PAGE}&sort=${sortOption}`)
        ]);

        const universityData = await universityResponse.json();
        const reviewsData = await reviewsResponse.json();
        
        setUniversity(universityData);

        if (reviewsData.reviews && reviewsData.reviews.length > 0) {
          const { token } = useAuthStore.getState();
          let processedReviews = reviewsData.reviews;
          
          if (token) {
            try {
              const reviewIds = reviewsData.reviews.map(r => r.id).join(',');
              const likeResponse = await fetch(
                `${process.env.REACT_APP_API_URL}/reviews/bulk-like-status?reviewIds=${reviewIds}`,
                {
                  headers: { "Authorization": `Bearer ${token}` }
                }
              );
              const likeData = await likeResponse.json();
              
              processedReviews = reviewsData.reviews.map(review => ({
                ...review,
                isLiked: likeData.likes[review.id] || false
              }));
            } catch (error) {
              console.error('Error fetching like status:', error);
              processedReviews = reviewsData.reviews.map(r => ({ ...r, isLiked: false }));
            }
          } else {
            processedReviews = reviewsData.reviews.map(r => ({ ...r, isLiked: false }));
          }
          
          setReviews(processedReviews);
          
          if (reviewsData.averages) {
            setAverageRatings({
              overall: Number(reviewsData.averages.overall) || 0,
              safety: Number(reviewsData.averages.safety) || 0,
              social: Number(reviewsData.averages.social) || 0,
              clubs: Number(reviewsData.averages.clubs) || 0,
              facilities: Number(reviewsData.averages.facilities) || 0,
              athletics: Number(reviewsData.averages.athletics) || 0,
              academic: Number(reviewsData.averages.academic) || 0,
              professors: Number(reviewsData.averages.professors) || 0,
              difficulty: Number(reviewsData.averages.difficulty) || 0,
              opportunities: Number(reviewsData.averages.opportunities) || 0,
              internet: Number(reviewsData.averages.internet) || 0,
              location: Number(reviewsData.averages.location) || 0,
              housing: Number(reviewsData.averages.housing) || 0,
              food: Number(reviewsData.averages.food) || 0,
              transportation: Number(reviewsData.averages.transportation) || 0,
              happiness: Number(reviewsData.averages.happiness) || 0,
            });
          }
          
          if (reviewsData.pagination) {
            setTotalPages(reviewsData.pagination.totalPages);
            setTotalReviews(reviewsData.pagination.totalReviews);
          }
        } else {
          setReviews([]);
          setAverageRatings({
            overall: 0, safety: 0, social: 0, clubs: 0, facilities: 0,
            athletics: 0, academic: 0, professors: 0, difficulty: 0,
            opportunities: 0, internet: 0, location: 0, housing: 0,
            food: 0, transportation: 0, happiness: 0,
          });
        }
      } catch (error) {
        console.error('Error loading university details:', error);
        setShowNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUniversityDetails();
    }
  }, [id, currentPage, sortOption]);

  // Search universities for comparison
  useEffect(() => {
    const searchUniversities = async () => {
      if (compareSearchTerm.length < 2) {
        setCompareSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/searchUniversity/all?query=${compareSearchTerm}`
        );
        const universities = await response.json();
        
        const filtered = universities.filter(uni => uni.id !== parseInt(id));
        setCompareSearchResults(filtered.slice(0, 5));
      } catch (error) {
        console.error('Error searching universities:', error);
        setCompareSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUniversities, 300);
    return () => clearTimeout(timeoutId);
  }, [compareSearchTerm, id]);

  const handleRateClick = () => {
    navigate(`/addReview/${university.id}`);
  };

  const handleCompareClick = () => {
    setShowCompareModal(true);
  };

  const handleCompareSelect = (compareUniId) => {
    navigate(`/compare?uni1=${id}&uni2=${compareUniId}`);
  };

  const handleLikeReview = useCallback(async (reviewId) => {
    const { token, refresh } = useAuthStore.getState();
    if (!token) {
      return { needsLogin: true };
    }
  
    try {
      const decoded = jwtDecode(token);
      let currentToken = token;

      if (decoded.exp * 1000 < Date.now()) {
        currentToken = await refresh();
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}/like`, {
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
  
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { 
              ...review, 
              likes: data.likes,
              isLiked: data.hasLiked
            }
          : review
      ));
      return { success: true, hasLiked: data.hasLiked };
    } catch (error) {
      console.error("Error liking review:", error);
      return { error: true };
    }
  }, []);

  const topCategories = useMemo(() => {
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
  }, [averageRatings]);

  if (showNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-4 sm:mb-6">
            404
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">University not found</h1>
          <p className="text-base sm:text-xl text-gray-300">The university you're looking for doesn't exist in our database</p>
        </div>
      </div>
    );
  }

  if (isLoading || !university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>
          {university.name.length > 30 
            ? `${university.name} Reviews | RateMyUniversity`
            : `${university.name} Reviews - ${university.country} | RateMyUniversity`
          }
        </title>
        <link 
          rel="canonical" 
          href={`https://ratemyuniversity.io/university/${id}`}
        />
        <meta name="description" content={`${totalReviews} student reviews of ${university.name} in ${university.country}. Average rating: ${averageRatings.overall.toFixed(1)}/5.0. Read about academics, campus life, safety, and more.`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": university.name,
            "url": university.web_pages?.[0],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRatings.overall,
              "reviewCount": totalReviews
            }
          })}
        </script>
      </Helmet>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <header className="relative py-6 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-12 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 leading-tight px-2">
          {university.name}
        </h1>
        <div className="inline-flex items-center backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3">
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="text-sm sm:text-lg font-medium text-gray-700">{university.country}</span>
        </div>
        
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
            <button
              onClick={handleRateClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              <span className="hidden xs:inline">Rate This University</span>
              <span className="xs:hidden">Rate University</span>
            </button>
            
            <a
                href={university.web_pages[0]?.replace(/^['"]+|['"]+$/g, '')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
                <span className="hidden sm:inline">Visit Website</span>
                <span className="sm:hidden">Website</span>
              </a>

            <button
              onClick={handleCompareClick}
              className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Compare</span>
            </button>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <a
            href={`https://www.ratemyprofessors.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-red-500 flex items-center gap-1"
            title="Rate professors on RateMyProfessors"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Rate Professors
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`https://www.ratemycourses.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-green-500 flex items-center gap-1"
            title="Rate courses on RateMyProfessors"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Rate Courses
          </a>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:px-8 lg:px-12 pb-12 sm:pb-20">
        {/* Overall Rating */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-8 sm:mb-16 border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          <div className="relative p-5 sm:p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Rating Circle */}
              <div className="lg:w-1/3 flex flex-col items-center mb-8 sm:mb-10 lg:mb-0 relative">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-pink-100 animate-pulse opacity-30"></div>
                  <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
                    <span className="text-3xl sm:text-5xl font-bold text-white">{averageRatings.overall.toFixed(1)}</span>
                  </div>
                  <div className="absolute -inset-1 sm:-inset-2 rounded-full border-2 sm:border-4 border-blue-200/50 animate-spin-slow opacity-70"></div>
                </div>
                <div className="mt-4 sm:mt-8 text-center">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Overall Rating</h2>
                  <div className="flex justify-center space-x-0.5 sm:space-x-1">
                    <RatingStars rating={averageRatings.overall} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="lg:w-2/3 lg:pl-10 w-full">
                <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Best-Rated Features</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {topCategories.map((category, index) => (
                    <div 
                      key={index}
                      className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <span className="text-2xl sm:text-3xl md:text-4xl mr-2 sm:mr-4">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 mb-1 truncate">{category.label}</h4>
                          <div className="flex items-center">
                            <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden mr-2 sm:mr-3">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-teal-400" 
                                style={{ width: `${(category.value / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm sm:text-lg font-bold text-gray-700 flex-shrink-0">{category.value.toFixed(1)}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8 mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-800">
              Student Reviews ({totalReviews})
            </h3>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => {
                  setSortOption('recent');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  sortOption === 'recent' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => {
                  setSortOption('popular');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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
            <div className="text-center py-8 sm:py-12">
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:space-y-8">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id}
                    review={review}
                    onLike={handleLikeReview}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Compare Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={compareModalRef} className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Compare With...</h3>
                <button
                  onClick={() => {
                    setShowCompareModal(false);
                    setCompareSearchTerm('');
                    setCompareSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Search for another university to compare with <span className="font-semibold">{university.name}</span>
              </p>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  value={compareSearchTerm}
                  onChange={(e) => setCompareSearchTerm(e.target.value)}
                  placeholder="Search universities..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              {compareSearchResults.length > 0 ? (
                <div className="space-y-2">
                  {compareSearchResults.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => handleCompareSelect(uni.id)}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <div className="font-semibold text-gray-800">{uni.name}</div>
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {uni.country}
                      </div>
                    </button>
                  ))}
                </div>
              ) : compareSearchTerm.length >= 2 && !isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  No universities found
                </div>
              ) : compareSearchTerm.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                  Start typing to search universities
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );  
};

const ReviewCard = React.memo(({ review, onLike }) => {
  const username = review.username || "Anonymous";
  const reviewDate = review.created_at ? new Date(review.created_at) : null;
  const formattedDate = reviewDate ? reviewDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : "No date";
  
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
    <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow duration-200">
      <div className="flex flex-col xs:flex-row justify-between items-start gap-2 mb-3 sm:mb-4">
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 mr-2 sm:mr-3">
              {review.overall_rating?.toFixed(1) || "N/A"}
            </span>
            <RatingStars rating={review.overall_rating || 0} className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm text-gray-500">by {username}</span>
        </div>
        <div className="flex flex-col items-start xs:items-end">
          <span className="text-xs sm:text-sm text-gray-400">{formattedDate}</span>
        </div>
      </div>

      {review.review_text && (
        <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
          {review.review_text}
        </p>
      )}

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {ratingCategories.map((category, idx) => (
          <RatingPill 
            key={idx} 
            label={category.label} 
            value={category.value} 
            color={category.color} 
          />
        ))}
      </div>

      <div className="flex items-center mt-3 sm:mt-4">
        <LikeButton 
          review={review} 
          onLike={onLike}
        />
      </div>

      {review.comments && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-gray-500 italic text-sm sm:text-base">"{review.comments}"</p>
        </div>
      )}
    </div>
  );
});

const LikeButton = ({ review, onLike }) => {
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const promptRef = useRef(null);
  const navigate = useNavigate();
  
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
          className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
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
        <span className="text-xs sm:text-sm font-medium">{review.likes || 0}</span>
      </button>

      {showLoginPrompt && (
        <div className="absolute z-10 w-56 sm:w-64 p-3 mt-2 -left-24 sm:-left-32 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">Please log in</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">You need to be logged in to like reviews</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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

const CategoryCard = ({ title, icon, ratings, colorFrom, colorTo }) => (
  <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-white/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="p-4 sm:p-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <span className="text-2xl sm:text-4xl mr-2 sm:mr-4">{icon}</span>
        <h3 className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${colorFrom} ${colorTo} bg-clip-text text-transparent`}>
          {title}
        </h3>
      </div>
      <div className="space-y-3 sm:space-y-5">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm sm:text-base text-gray-700 font-medium">{rating.label}</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo}`} 
                  style={{ width: `${(rating.value / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm sm:text-base text-gray-900 font-bold w-7 sm:w-8 text-right">{rating.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RatingPill = ({ label, value, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200"
  };
  
  return (
    <div className={`flex flex-col p-1.5 sm:p-2 rounded-lg border ${colorClasses[color]}`}>
      <span className="text-xs font-medium truncate">{label}</span>
      <div className="flex items-center justify-between mt-0.5 sm:mt-1">
        <span className="text-xs sm:text-sm font-bold">{value.toFixed(1)}</span>
        <RatingStars rating={value} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      </div>
    </div>
  );
};

const StarIcon = ({ filled, percent = 0, className = "w-5 h-5" }) => {
  if (typeof filled === 'boolean') {
    return (
      <svg 
        className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }

  const clipPathWidth = Math.round(percent * 100);

  return (
    <div className="relative inline-block">
      <svg 
        className={`${className} text-gray-300`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      <div 
        className={`absolute top-0 left-0 overflow-hidden`} 
        style={{ width: `${clipPathWidth}%` }}
      >
        <svg 
          className={`${className} text-yellow-400`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      </div>
    </div>
  );
};

const RatingStars = ({ rating, className = "w-5 h-5" }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} filled className={className} />
      ))}
      
      {partialStar > 0 && (
        <StarIcon key="partial" percent={partialStar} className={className} />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} filled={false} className={className} />
      ))}
    </div>
  );
};

export default University;