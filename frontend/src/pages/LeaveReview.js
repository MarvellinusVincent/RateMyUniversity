import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAxios } from '../stores/authStore';
import { Helmet } from 'react-helmet-async';

const LeaveReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [universityName, setUniversityName] = useState('');
  const [isLoadingUniversity, setIsLoadingUniversity] = useState(true);
  const { universityId } = useParams();

  const ratingRefs = useRef({});

  useEffect(() => {
    const fetchUniversityName = async () => {
      setIsLoadingUniversity(true);
      try {
        const response = await authAxios.get(
          `${process.env.REACT_APP_API_URL}/specificUni/university_name/${universityId}`
        );
        if (response.data.success) {
          setUniversityName(response.data.data.name);
        } else {
          console.error('Failed to fetch university name:', response.data.error);
          setUniversityName("University");
        }
      } catch (error) {
        console.error('Error fetching university name:', error);
        setUniversityName("University");
      } finally {
        setIsLoadingUniversity(false);
      }
    };
    if (universityId) {
      fetchUniversityName();
    } else {
      setIsLoadingUniversity(false);
    }
  }, [universityId, location.search]);

  const [formData, setFormData] = useState({
    academic_rating: '',
    professors_rating: '',
    difficulty_rating: '',
    opportunities_rating: '',
    internet_rating: '',
    safety_rating: '',
    social_life_rating: '',
    clubs_rating: '',
    facilities_rating: '',
    athletics_rating: '',
    location_rating: '',
    housing_rating: '',
    food_rating: '',
    transportation_rating: '',
    happiness_rating: '',
    overall_rating: '',
    review_text: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStarClick = (field, rating) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: rating
    }));
    
    if (errorMessages[field]) {
      setErrorMessages((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };

  const validateForm = () => {
    const errors = {};
    const missingRatings = [];
    let isValid = true;

    for (const field in formData) {
      if (field !== 'comments' && field !== 'review_text' && formData[field] === '') {
        const fieldLabel = field.replace(/_/g, ' ').replace(/rating/i, '').trim();
        errors[field] = `Required`;
        missingRatings.push(fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1));
        isValid = false;
      }
    }

    setErrorMessages(errors);

    if (!isValid) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && ratingRefs.current[firstErrorField]) {
        ratingRefs.current[firstErrorField].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }

      showToast(
        `Please provide ratings for: ${missingRatings.slice(0, 5).join(', ')}${missingRatings.length > 5 ? '...' : ''}`,
        'error'
      );
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewData = {
        ...formData,
        university_id: universityId,
        university_name: universityName,
        user_id: isAuthenticated() ? user.id : null,
        is_anonymous: !isAuthenticated()
      };

      const response = await authAxios.post(`${process.env.REACT_APP_API_URL}/reviews/submit`, reviewData);

      if (response.status === 200) {
        showToast('Review submitted successfully!', 'success');
        setTimeout(() => {
          navigate(`/university/${universityId}`);
        }, 3000);
      } else {
        const errorData = response.data;
        showToast(errorData.message || 'Failed to submit review', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast(error.response?.data?.message || 'An error occurred while submitting your review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (field) => {
    const currentRating = formData[field];
    const hoverRating = hoverRatings[field] || 0;
  
    return (
      <div className="flex space-x-0.5 sm:space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            onClick={() => handleStarClick(field, rating)}
            onMouseEnter={() => setHoverRatings((prev) => ({ ...prev, [field]: rating }))}
            onMouseLeave={() => setHoverRatings((prev) => ({ ...prev, [field]: 0 }))}
            className={`cursor-pointer text-xl sm:text-2xl p-0.5 sm:p-1 ${
              rating <= (hoverRating || currentRating) ? 'text-yellow-400' : 'text-gray-300'
            } transition transform duration-200 hover:scale-110`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingCategory = (field, label, icon) => {
    const hasError = errorMessages[field];
    
    return (
      <div 
        ref={el => ratingRefs.current[field] = el}
        className={`p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 transition-all duration-300 ${
          hasError 
            ? 'bg-red-50 border-2 border-red-500 shadow-md' 
            : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm'
        }`}
      >
        <div className="flex items-center mb-2">
          <span className="text-lg sm:text-2xl mr-2">{icon}</span>
          <h3 className="font-medium text-gray-800 text-sm sm:text-base">{label}</h3>
        </div>
        {renderStars(field)}
        {hasError && (
          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessages[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Review {universityName || 'University'} - RateMyUniversity</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={`Share your experience about ${universityName || 'this university'}. Help future students make informed decisions.`} />
      </Helmet>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-xs sm:max-w-md animate-slide-in`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium text-sm sm:text-base">{toast.message}</span>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          
          <div className="relative p-5 sm:p-8 md:p-10">
            <div className="flex justify-start mb-4 sm:mb-6">
              <button
                onClick={() => navigate(`/university/${universityId}`)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to University
              </button>
            </div>
            
            {isLoadingUniversity ? (
              <div className="animate-pulse h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mb-2"></div>
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
                {universityName || 'University'}
              </h1>
            )}
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Share your experience to help others
            </p>

            {!isAuthenticated() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-yellow-700">
                      You're submitting this review anonymously. <a href="/login" className="font-medium text-yellow-700 underline hover:text-yellow-600">Log in</a> to associate it with your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div 
                ref={el => ratingRefs.current['overall_rating'] = el}
                className={`p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  errorMessages.overall_rating
                    ? 'bg-red-50 border-2 border-red-500 shadow-md'
                    : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm'
                }`}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Overall Rating</h2>
                <div className="flex justify-center">
                  <div className="text-center">
                    {renderStars('overall_rating')}
                    {errorMessages.overall_rating && (
                      <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMessages.overall_rating}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Academics</h3>
                  {renderRatingCategory('academic_rating', 'Academic', '📚')}
                  {renderRatingCategory('professors_rating', 'Professors', '👨‍🏫')}
                  {renderRatingCategory('difficulty_rating', 'Difficulty', '🧠')}
                  {renderRatingCategory('opportunities_rating', 'Opportunities', '💼')}
                  {renderRatingCategory('internet_rating', 'Internet', '🌐')}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Campus Life</h3>
                  {renderRatingCategory('safety_rating', 'Safety', '👮‍♂️')}
                  {renderRatingCategory('social_life_rating', 'Social Life', '🎉')}
                  {renderRatingCategory('clubs_rating', 'Clubs', '🎭')}
                  {renderRatingCategory('facilities_rating', 'Facilities', '🏛️')}
                  {renderRatingCategory('athletics_rating', 'Athletics', '🏈')}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Living</h3>
                  {renderRatingCategory('location_rating', 'Location', '📍')}
                  {renderRatingCategory('housing_rating', 'Housing', '🏠')}
                  {renderRatingCategory('food_rating', 'Food', '🍕')}
                  {renderRatingCategory('transportation_rating', 'Transportation', '🚌')}
                  {renderRatingCategory('happiness_rating', 'Happiness', '🌞')}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Your Review</h2>
                <textarea
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-3 sm:p-4 text-sm sm:text-base bg-white/80 border border-gray-200/70 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Share your detailed experience..."
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Additional Comments</h2>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 sm:p-4 text-sm sm:text-base bg-white/80 border border-gray-200/70 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Any other thoughts you'd like to share..."
                />
              </div>

              <div className="flex justify-center pt-2 sm:pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LeaveReview;