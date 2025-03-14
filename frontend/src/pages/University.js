import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const University = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);

  const universityName = new URLSearchParams(location.search).get('name');

  // Fetch university details
  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        // Fetch university details from backend
        const response = await fetch(`/api/specificUni?name=${universityName}`);
        const universityData = await response.json();
        setUniversity(universityData);

        // Fetch reviews for the university
        if (universityData.id) {
          const reviewsResponse = await fetch(`/api/specificUni/${universityData.id}/reviews`);
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
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
    navigate(`/rate/${universityName}`);
  };

  if (!university) {
    return (
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mt-8">
          <h1 className="text-2xl font-bold text-center mb-4">University not found!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">{university.name}</h1>
        <p className="text-center mb-4">{university.country}</p>
        <a
          href={university.web_pages[0]?.replace(/^['"]+|['"]+$/g, '')}  // This ensures no quotes are present
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mb-4"
        >
          Visit University Website
        </a>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mb-4">
            {reviews && reviews.length === 0 ? (
              <p>No reviews yet for this university.</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                  <p><strong>{review.title}</strong></p>
                  <p>{review.body}</p>
                  <p>Rating: {review.rating}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleRateClick}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Rate this University
          </button>
        </div>
      </div>
    </div>
  );
};

export default University;