import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAxios } from "../stores/authStore";

const SavedReviews = () => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingReviewId, setDeletingReviewId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!isAuthenticated() || !user?.id) {
                setIsLoading(false);
                return;
            }
            
            try {
                setIsLoading(true);
                setError(null);
                const response = await authAxios.get(`${process.env.REACT_APP_API_URL}/users/getReviews`);
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

    const handleDeleteReview = async (reviewId) => {
        const review = reviews.find(r => r.id === reviewId);
        setReviewToDelete(review);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!reviewToDelete) return;
        
        try {
            setDeletingReviewId(reviewToDelete.id);
            await authAxios.delete(`${process.env.REACT_APP_API_URL}/reviews/delete/${reviewToDelete.id}`);
            setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (err) {
            console.error("Failed to delete review:", err);
            setError("Failed to delete review. Please try again.");
        } finally {
            setDeletingReviewId(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    if (!isAuthenticated()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 max-w-md text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Authentication Required</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">Please log in to view your saved reviews</p>
                    <a 
                        href="/login" 
                        className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    const StarRating = ({ rating = 0, size = "md" }) => {
        const sizes = {
            sm: "w-3.5 h-3.5 sm:w-4 sm:h-4",
            md: "w-4 h-4 sm:w-5 sm:h-5",
            lg: "w-5 h-5 sm:w-6 sm:h-6"
        };
        
        const safeRating = rating || 0;
        
        return (
            <div className="flex items-center">
                <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mr-1.5 sm:mr-2">
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
        <div className="bg-white/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-lg border border-gray-200/30 shadow-xs hover:shadow-sm transition-all">
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{label}</div>
            <StarRating rating={value} size="sm" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/3 -right-20 w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
                <div className="mb-3 sm:mb-4">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-blue-300 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        <span className="text-sm sm:text-base font-medium text-gray-700">Browse Universities</span>
                    </Link>
                </div>
                
                {/* All Saved Reviews Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
                    
                    <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
                        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                                    Your Saved Reviews
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                                    All reviews you've saved or created
                                </p>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">
                                <p className="text-sm sm:text-base">{error}</p>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">No reviews found</p>
                            </div>
                        ) : (
                            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
                                {reviews.map((review) => (
                                    <div 
                                        key={review.id} 
                                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 sm:flex-row sm:justify-between sm:items-start">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors truncate">
                                                    <Link to={`/university/${review.university_id}`}>
                                                        {review.university_name}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : 'No date available'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <StarRating rating={review.overall_rating} />
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    disabled={deletingReviewId === review.id}
                                                    className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                                    title="Delete review"
                                                >
                                                    {deletingReviewId === review.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-red-500"></div>
                                                    ) : (
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {review.review_text && (
                                            <div className="mb-4 sm:mb-6">
                                                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                                                    {review.review_text}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
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
                                            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                                                <p className="text-sm sm:text-base text-gray-600 italic">"{review.comments}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-5 sm:p-6 max-w-md w-full mx-4 border border-white/20">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2">
                            Delete Review
                        </h3>
                        
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-5 sm:mb-6">
                            Are you sure you want to delete your review for{" "}
                            <span className="font-semibold text-gray-900">
                                {reviewToDelete?.university_name}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        
                        <div className="flex gap-2 sm:gap-3 justify-end">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
                                disabled={deletingReviewId === reviewToDelete?.id}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deletingReviewId === reviewToDelete?.id}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deletingReviewId === reviewToDelete?.id ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedReviews;