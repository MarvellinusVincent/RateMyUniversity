import { Helmet } from 'react-helmet-async';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Community Guidelines - RateMyUniversity</title>
        <link rel="canonical" href="https://ratemyuniversity.io/guidelines" />
        <meta name="description" content="Community guidelines for RateMyUniversity - Learn about our standards for respectful reviews and transparent university ratings" />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          
          <div className="relative p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6 text-center">
              Community Guidelines
            </h1>
            
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  Welcome to Our Community
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  RateMyUniversity is built on the foundation of honest, transparent feedback. 
                  We believe every opinion matters and every experience is valid. These guidelines help ensure 
                  our platform remains valuable for everyone.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  What We Encourage
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3 mt-1">
                      <span className="text-blue-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Honest Opinions</h3>
                      <p className="text-gray-600 text-sm">Share your genuine experiences, both positive and negative</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-50 p-2 rounded-lg mr-3 mt-1">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Detailed Reviews</h3>
                      <p className="text-gray-600 text-sm">Provide specific examples and context for your ratings</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-50 p-2 rounded-lg mr-3 mt-1">
                      <span className="text-purple-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Constructive Feedback</h3>
                      <p className="text-gray-600 text-sm">Help future students make informed decisions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-50 p-2 rounded-lg mr-3 mt-1">
                      <span className="text-yellow-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Diverse Perspectives</h3>
                      <p className="text-gray-600 text-sm">Every student's experience is unique and valuable</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  Our Primary Rule
                </h2>
                <div className="bg-white/80 p-4 rounded-lg border border-red-200/30">
                  <h3 className="font-bold text-red-700 mb-2">No Slandering Other Users</h3>
                  <p className="text-gray-700 mb-3">
                    While we welcome all transparent opinions about universities, we do not tolerate attacks 
                    on other community members. This includes:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2 flex items-center mt-0.5">•</span>
                      <span>Personal attacks on other reviewers or commenters</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2 flex items-center mt-0.5">•</span>
                      <span>Harassment or bullying of other users</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2 flex items-center mt-0.5">•</span>
                      <span>Attempts to discredit someone's review through personal insults</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2 flex items-center mt-0.5">•</span>
                      <span>Sharing personal information about other users</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  How to Disagree Respectfully
                </h2>
                <p className="text-gray-700 mb-4">
                  Different students have different experiences at the same university. If you disagree with 
                  someone's review, here's how to express your perspective constructively:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-1 rounded mr-3 flex items-center justify-center h-6 w-6 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <p className="text-gray-600">Share your own experience rather than attacking theirs</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-1 rounded mr-3 flex items-center justify-center h-6 w-6 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <p className="text-gray-600">Acknowledge that experiences can vary by program, year, or personal circumstances</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-1 rounded mr-3 flex items-center justify-center h-6 w-6 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <p className="text-gray-600">Use phrases like "In my experience..." or "I had a different experience with..."</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-1 rounded mr-3 flex items-center justify-center h-6 w-6 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">4</span>
                    </div>
                    <p className="text-gray-600">Focus on the university aspects, not the person who wrote the review</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-teal-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  The Difference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-700 mb-2">✓ Acceptable</h3>
                    <ul className="space-y-2 text-green-600 text-sm">
                      <li>"The dining hall food quality was disappointing"</li>
                      <li>"I found the professors in the engineering department unhelpful"</li>
                      <li>"The campus safety measures were useless"</li>
                      <li>"Housing maintenance was slow to respond"</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-bold text-red-700 mb-2">✗ Not Acceptable</h3>
                    <ul className="space-y-2 text-red-600 text-sm">
                      <li>"This person is clearly lying about their experience"</li>
                      <li>"Don't trust this person's opinion, they're just bitter"</li>
                      <li>"This person always posts negative reviews"</li>
                      <li>Any personal information about other reviewers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  Reporting and Enforcement
                </h2>
                <p className="text-gray-700 mb-4">
                  If you encounter content that violates our community guidelines:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Contact our moderation team directly for serious violations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Violations may result in content removal and account restrictions</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/50 p-6 rounded-xl shadow-sm text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Thank You for Being Part of Our Community
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your honest reviews and respectful interactions make RateMyUniversity a valuable resource 
                  for students everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;