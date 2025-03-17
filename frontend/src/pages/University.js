import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const University = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [usernames, setUsernames] = useState({});  // Store usernames for reviews

  const universityName = new URLSearchParams(location.search).get('name');

  // Fetch university details and reviews
  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        // Fetch university details from backend
        const response = await fetch(`/api/specificUni?name=${universityName}`);
        const universityData = await response.json();
        console.log(universityData);
        setUniversity(universityData);

        // Fetch reviews for the university
        if (universityData.id) {
          const reviewsResponse = await fetch(`api/specificUni/${universityData.id}/reviews`);
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);

          // Fetch usernames for reviews with a valid user_id
          const users = {};
          for (let review of reviewsData.reviews) {
            if (review.user_id) {
              // Fetch the username for each review's user_id
              const userResponse = await fetch(`api/users/getUser?userID=${review.user_id}`);
              const userData = await userResponse.json();
              users[review.user_id] = userData.username;
            } else {
              users[review.id] = "Anonymous";  // Default to "Anonymous" if user_id is null
            }
          }
          setUsernames(users);  // Update the usernames state
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
    navigate(`/leaveReview?id=${university.id}`);
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
          href={university.web_pages[0]?.replace(/^['"]+|['"]+$/g, '')}
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
              reviews.map((review, index) => {
                // Log the entire review object for debugging
                console.log(`Review ${index + 1}:`, review);

                const username = usernames[review.user_id] || "Anonymous";  // Fetch username from the state

                return (
                  <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                    <p><strong>User:</strong> {username}</p>
                    <p><strong>Review Text:</strong> {review.review_text}</p>
                    <p><strong>Overall Rating:</strong> {review.overall_rating}</p>
                    <p><strong>Academic Rating:</strong> {review.academic_rating}</p>
                    <p><strong>Campus Rating:</strong> {review.campus_rating}</p>
                    <p><strong>Social Life Rating:</strong> {review.social_life_rating}</p>
                    <p><strong>Living Rating:</strong> {review.living_rating}</p>
                    <p><strong>Food Rating:</strong> {review.food_rating}</p>
                    <p><strong>Transportation Rating:</strong> {review.transportation_rating}</p>
                    <p><strong>Comments:</strong> {review.comments}</p>
                  </div>
                );
              })
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
