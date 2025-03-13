import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const University = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);

  const universityName = new URLSearchParams(location.search).get('name');

  // Fetch university details
  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const response = await fetch('/world_universities_and_domains.json');
        const data = await response.json();
        const uni = data.find((u) => u.name === universityName);
        setUniversity(uni);
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

  if (!university) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">{university.name}</h1>
        <p className="text-center mb-4">{university.country}</p>
        <a
          href={university.web_pages[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mb-4"
        >
          Visit University Website
        </a>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Rating Distribution</h2>
          {/* Your rating distribution logic here */}
          <div>{/* Display rating distribution */}</div>
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
