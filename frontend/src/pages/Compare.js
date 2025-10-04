import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

const Compare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const uni1Id = searchParams.get('uni1');
  const uni2Id = searchParams.get('uni2');

  const [universities, setUniversities] = useState([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uni1Id || !uni2Id) {
      setError('Two universities are required for comparison');
      setIsLoading(false);
      return;
    }

    const fetchComparisonData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/compare?uni1=${uni1Id}&uni2=${uni2Id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }
        
        const data = await response.json();
        setUniversities([data.university1, data.university2]);
      } catch (err) {
        console.error('Error fetching comparison:', err);
        setError('Failed to load comparison data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [uni1Id, uni2Id]);

  const comparisonCategories = useMemo(() => [
    { key: 'overall', label: 'Overall Rating', icon: '⭐' },
    { key: 'happiness', label: 'Happiness', icon: '🌞' },
    { key: 'academic', label: 'Academics', icon: '📚' },
    { key: 'professors', label: 'Professors', icon: '👨‍🏫' },
    { key: 'difficulty', label: 'Difficulty', icon: '🧠' },
    { key: 'opportunities', label: 'Opportunities', icon: '💼' },
    { key: 'social', label: 'Social Life', icon: '🎉' },
    { key: 'clubs', label: 'Clubs', icon: '🎭' },
    { key: 'athletics', label: 'Athletics', icon: '🏈' },
    { key: 'safety', label: 'Safety', icon: '👮‍♂️' },
    { key: 'facilities', label: 'Facilities', icon: '🏛️' },
    { key: 'internet', label: 'Internet', icon: '🌐' },
    { key: 'location', label: 'Location', icon: '📍' },
    { key: 'housing', label: 'Housing', icon: '🏠' },
    { key: 'food', label: 'Food', icon: '🍕' },
    { key: 'transportation', label: 'Transportation', icon: '🚌' }
  ], []);

  const getWinner = (val1, val2) => {
    if (val1 === val2) return 'tie';
    return val1 > val2 ? 'left' : 'right';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !universities[0] || !universities[1]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Failed to Load Comparison</h3>
          <p className="mt-2 text-gray-500">{error || 'Please try again'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const [uni1, uni2] = universities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>{`Compare ${uni1.name} vs ${uni2.name} | RateMyUniversity`}</title>
        <meta name="description" content={`Compare student reviews of ${uni1.name} and ${uni2.name}. See ratings for academics, campus life, facilities, and more.`} />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4">
            University Comparison
          </h1>
          <p className="text-gray-600 text-lg">Side-by-side comparison of student reviews</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          <UniversityHeader university={uni1} position="left" />
          <UniversityHeader university={uni2} position="right" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          <StatsCard university={uni1} />
          <StatsCard university={uni2} />
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Detailed Comparison</h2>
          
          <div className="space-y-4">
            {comparisonCategories.map((category) => {
              const val1 = uni1.averages[category.key];
              const val2 = uni2.averages[category.key];
              const winner = getWinner(val1, val2);

              return (
                <ComparisonRow
                  key={category.key}
                  category={category}
                  value1={val1}
                  value2={val2}
                  winner={winner}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
          <Link
            to={`/university/${uni1.id}`}
            className="bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 text-center font-semibold text-blue-600 hover:text-blue-700 transition-all"
          >
            View {uni1.name} Profile
          </Link>
          <Link
            to={`/university/${uni2.id}`}
            className="bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 text-center font-semibold text-blue-600 hover:text-blue-700 transition-all"
          >
            View {uni2.name} Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const UniversityHeader = ({ university, position }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-2 ${
    position === 'left' ? 'border-blue-300' : 'border-teal-300'
  }`}>
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
      {university.name}
    </h2>
    <div className="flex items-center text-gray-600 text-sm sm:text-base">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="truncate">{university.country}</span>
    </div>
  </div>
);

const StatsCard = ({ university }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 sm:p-6 shadow-lg">
    <div className="flex flex-col items-center">
      <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
        {university.averages.overall.toFixed(1)}
      </div>
      <RatingStars rating={university.averages.overall} />
      <p className="text-sm text-gray-500 mt-2">
        {university.reviewCount} {university.reviewCount === 1 ? 'review' : 'reviews'}
      </p>
    </div>
  </div>
);

const ComparisonRow = ({ category, value1, value2, winner }) => {
  const maxValue = Math.max(value1, value2);
  const percentage1 = maxValue > 0 ? (value1 / maxValue) * 100 : 0;
  const percentage2 = maxValue > 0 ? (value2 / maxValue) * 100 : 0;

  return (
    <div className="relative">
      <div className="text-center mb-2">
        <span className="text-lg sm:text-xl">{category.icon}</span>
        <span className="ml-2 font-medium text-gray-700 text-sm sm:text-base">{category.label}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex items-center">
          <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`h-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500 ${
                winner === 'left' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}
              style={{ width: `${percentage1}%` }}
            >
              <span className={`font-bold text-sm sm:text-base ${winner === 'left' ? 'text-white' : 'text-gray-700'}`}>
                {value1.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`h-full flex items-center justify-start pl-2 sm:pl-3 transition-all duration-500 ${
                winner === 'right' ? 'bg-gradient-to-l from-teal-500 to-teal-600' : 'bg-gradient-to-l from-gray-300 to-gray-400'
              }`}
              style={{ width: `${percentage2}%` }}
            >
              <span className={`font-bold text-sm sm:text-base ${winner === 'right' ? 'text-white' : 'text-gray-700'}`}>
                {value2.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      {partialStar > 0 && (
        <div className="relative">
          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default Compare;