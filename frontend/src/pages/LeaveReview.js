import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContexts';

const LeaveReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const universityId = new URLSearchParams(location.search).get('id');

  const [formData, setFormData] = useState({
    academic_rating: '',
    campus_rating: '',
    social_life_rating: '',
    living_rating: '',
    food_rating: '',
    transportation_rating: '',
    overall_rating: '',
    review_text: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

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
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    for (const field in formData) {
      if (formData[field] === '') {
        errors[field] = `${field.replace('_', ' ')} is required.`;
        isValid = false;
      }
    }

    setErrorMessages(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const userId = user ? user.id : -1;

    try {
      const response = await fetch(`/api/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          university_id: universityId,
          user_id: userId,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        navigate(`/university?id=${universityId}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (field) => {
    const currentRating = formData[field];

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            onClick={() => handleStarClick(field, rating)}
            className={`cursor-pointer text-2xl ${rating <= currentRating ? 'text-yellow-500' : 'text-gray-300'} 
              transition transform duration-200 hover:scale-110 hover:text-yellow-400`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">Leave a Review</h1>

        <form onSubmit={handleSubmit}>
          {['academic_rating', 'campus_rating', 'social_life_rating', 'living_rating', 'food_rating', 'transportation_rating', 'overall_rating'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block font-semibold mb-2">{field.replace('_', ' ').toUpperCase()}</label>
              {renderStars(field)}
              {errorMessages[field] && (
                <p className="text-red-500 text-sm mt-1">{errorMessages[field]}</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block font-semibold mb-2">Review Text</label>
            <textarea
              name="review_text"
              value={formData.review_text}
              onChange={handleInputChange}
              rows="4"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errorMessages.review_text && (
              <p className="text-red-500 text-sm mt-1">{errorMessages.review_text}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Additional Comments (optional)</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errorMessages.comments && (
              <p className="text-red-500 text-sm mt-1">{errorMessages.comments}</p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveReview;
