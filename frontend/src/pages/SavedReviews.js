import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authAxios } from "../stores/authStore";
import { Link, useNavigate } from "react-router-dom";

const SavedReviews = () => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            if (!isAuthenticated() || !user?.id) {
                setIsLoading(false);
                return;
            }
            
            try {
                setIsLoading(true);
                setError(null);
                const response = await authAxios.get('http://localhost:1234/users/getReviews', {
                    params: { userId: user.id }
                });
                const reviewsData = response.data.reviews || response.data || [];
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status !== 404) {
                    setError("Failed to fetch reviews");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews()
    }, [user?.id, isAuthenticated]);

    if (!isAuthenticated()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to view your saved reviews</p>
                    <a 
                        href="/login" 
                        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    const StarRating = ({ rating = 0, size = "md" }) => {
        const sizes = {
            sm: "w-4 h-4",
            md: "w-5 h-5",
            lg: "w-6 h-6"
        };
        
        const safeRating = rating || 0;
        
        return (
            <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800 mr-2">
                    {safeRating.toFixed(1)}
                </span>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <svg 
                            key={i}
                            className={`${sizes[size]} ${i < Math.round(safeRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
            </div>
        );
    };

    const RatingCategory = ({ label, value = 0 }) => (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200/30 shadow-xs hover:shadow-sm transition-all">
            <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
            <StarRating rating={value} size="sm" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
                    
                    <div className="relative p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                                    Your Saved Reviews
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    All reviews you've saved or created
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/')}
                                className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Browse Universities
                            </button>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                                <p>{error}</p>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p className="mt-4 text-lg text-gray-600">No reviews found</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {reviews.map((review) => (
                                    <div 
                                        key={review.id} 
                                        className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                                    <Link to={`/university?name=${review.university_name}`}>
                                                        {review.university_name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : 'No date available'}
                                                </p>
                                            </div>
                                            <StarRating rating={review.overall_rating} />
                                        </div>

                                        {review.review_text && (
                                            <div className="mb-6">
                                                <p className="text-gray-700 text-lg leading-relaxed">
                                                    "{review.review_text}"
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            {review.academic_rating !== undefined && <RatingCategory label="Academics" value={review.academic_rating} />}
                                            {review.professors_rating !== undefined && <RatingCategory label="Professors" value={review.professors_rating} />}
                                            {review.facilities_rating !== undefined && <RatingCategory label="Facilities" value={review.facilities_rating} />}
                                            {review.social_life_rating !== undefined && <RatingCategory label="Social Life" value={review.social_life_rating} />}
                                            {review.clubs_rating !== undefined && <RatingCategory label="Clubs" value={review.clubs_rating} />}
                                            {review.happiness_rating !== undefined && <RatingCategory label="Happiness" value={review.happiness_rating} />}
                                            {review.safety_rating !== undefined && <RatingCategory label="Safety" value={review.safety_rating} />}
                                            {review.location_rating !== undefined && <RatingCategory label="Location" value={review.location_rating} />}
                                            {review.housing_rating !== undefined && <RatingCategory label="Housing" value={review.housing_rating} />}
                                            {review.food_rating !== undefined && <RatingCategory label="Food" value={review.food_rating} />}
                                            {review.transportation_rating !== undefined && <RatingCategory label="Transportation" value={review.transportation_rating} />}
                                            {review.internet_rating !== undefined && <RatingCategory label="Internet" value={review.internet_rating} />}
                                        </div>

                                        {review.comments && (
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <p className="text-gray-600 italic">"{review.comments}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedReviews;