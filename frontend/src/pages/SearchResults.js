import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Helmet } from 'react-helmet-async';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('name');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(query);
  
  useDebounce(() => { setDebouncedSearchTerm(query); }, 500, [query]);

  useEffect(() => {
    let isMounted = true;
    let minLoadingTimer;

    const fetchResults = async () => {
      if (!debouncedSearchTerm) {
        if (isMounted) {
          setResults(null);
          setLoading(false);
          setMinLoadingDone(true);
        }
        return;
      }

      try {
        minLoadingTimer = setTimeout(() => {
          if (isMounted) setMinLoadingDone(true);
        }, 300);

        if (isMounted) setLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/searchUniversity/all?query=${debouncedSearchTerm}`);
        const universities = await response.json();

        if (!isMounted) return;

        if (universities.length === 0) {
          await Promise.resolve();
          if (isMounted) {
            setResults([]);
            setLoading(false);
          }
          return;
        }

        const universitiesWithRatings = await Promise.all(
          universities.map(async (uni) => {
            try {
              const reviewsResponse = await fetch(`${process.env.REACT_APP_API_URL}/specificUni/${uni.id}/reviews`);
              const reviewsData = await reviewsResponse.json();
              const reviews = reviewsData.reviews || [];
              
              const totalRating = reviews.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
              const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
              
              return {
                ...uni,
                average_rating: averageRating,
                review_count: reviews.length
              };
            } catch (error) {
              console.error(`Error fetching reviews for university ${uni.id}:`, error);
              return {
                ...uni,
                average_rating: 0,
                review_count: 0
              };
            }
          })
        );

        const sortedResults = universitiesWithRatings.sort((a, b) => b.review_count - a.review_count);

        await Promise.resolve();
        if (isMounted) {
          setResults(sortedResults);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        await Promise.resolve();
        if (isMounted) {
          setResults([]);
          setLoading(false);
        }
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
      clearTimeout(minLoadingTimer);
    };
  }, [debouncedSearchTerm]);

  const RatingStars = ({ rating, className = "w-4 h-4 sm:w-5 sm:h-5" }) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;
    const emptyStars = 5 - Math.ceil(rating);

    const StarIcon = ({ filled, className }) => (
      <svg 
        className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} filled className={className} />
        ))}
        
        {partialStar > 0 && (
          <div className="relative">
            <StarIcon filled={false} className={className} />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
              <StarIcon filled className={className} />
            </div>
          </div>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} filled={false} className={className} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>{query ? `${query} - University Search Results | RateMyUniversity` : 'Search Universities | RateMyUniversity'}</title>
        <link rel="canonical" href={`https://ratemyuniversity.io/search/university${query ? `?name=${encodeURIComponent(query)}` : ''}`} />
        <meta name="description" content={query ? `Search results for "${query}". Find honest student reviews and ratings.` : 'Search thousands of universities and read authentic student reviews.'} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        <div className="flex justify-start mb-4 sm:mb-6 md:mb-8">
          <Link 
            to="/" 
            className="group flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-blue-300 transition-all duration-200"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-gray-900">
              Back to Home
            </span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          <div className="relative p-5 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
              Search Results
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
              Showing results for <span className="font-semibold text-gray-800">"{query}"</span>
            </p>

            {(!minLoadingDone || loading) ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mb-3 sm:mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-600">Finding matching universities...</p>
                </div>
              </div>
            ) : results === null ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">Ready to search</h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">Enter a search term to find universities</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-4 sm:space-y-6">
                  {results.map(uni => (
                    <Link 
                      key={uni.id} 
                      to={`/university/${uni.id}`}
                      className="block group"
                    >
                      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group-hover:border-blue-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                              {uni.name}
                            </h2>
                            <div className="flex items-center mt-1.5 sm:mt-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              <span className="text-sm sm:text-base text-gray-600 truncate">{uni.country}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
                            {uni.review_count > 0 ? (
                              <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                                  {uni.average_rating.toFixed(1)}
                                </div>
                                <div className="flex flex-col items-center">
                                  <RatingStars rating={uni.average_rating} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="text-xs text-gray-500 mt-1">
                                    {uni.review_count} {uni.review_count === 1 ? 'review' : 'reviews'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-xs sm:text-sm text-gray-500 italic">No reviews yet</div>
                              </div>
                            )}
                            <svg 
                              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center py-8 sm:py-12">
                  <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">Missing your university?</h3>
                  <p className="mt-1 text-sm sm:text-base text-gray-500">We'll add it to our database</p>
                  <div className="mt-4 sm:mt-6">
                    <Link
                      to="/addSchool"
                      className="inline-flex items-center px-3.5 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg className="-ml-0.5 sm:-ml-1 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add a School
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">No universities found</h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">Try a different search term or add your school</p>
                <div className="mt-4 sm:mt-6">
                  <Link
                    to="/addSchool"
                    className="inline-flex items-center px-3.5 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="-ml-0.5 sm:-ml-1 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add a School
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;