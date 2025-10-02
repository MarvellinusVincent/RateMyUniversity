import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>About Us - RateMyUniversity</title>
        <link rel="canonical" href="https://ratemyuniversity.io/about" />
        <meta name="description" content="Learn about RateMyUniversity - a platform created by students for students to share authentic university experiences and help others make informed decisions" />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          
          <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4 sm:mb-6 text-center">
              About RateMyUniversity
            </h1>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Our Mission</h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To provide a transparent website where students can share authentic experiences about their universities, 
                  helping future students make informed decisions about their education journey
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Our Story</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                  RateMyUniversity was created by a student who realized there was no dedicated website 
                  to comprehensively rate and review universities. While sites like Rate My Professors 
                  included some university ratings, there wasn't a website focused solely on the university itself
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  This website was built to fill that gap. It's a place where you can review every part of your university experience.
                  Feel free to leave your reviews and share your true feelings about the university you attended. Your honest opinion helps 
                  other students see what the school they're interested in is really like
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                      <span className="text-blue-600 text-lg sm:text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">Authenticity</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Real reviews from real students</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                      <span className="text-green-600 text-lg sm:text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">Transparency</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Honest, unfiltered experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                      <span className="text-purple-600 text-lg sm:text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">Community</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Students helping students</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                      <span className="text-yellow-600 text-lg sm:text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">Empowerment</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Helping you make informed choices</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/50 p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4 flex items-center">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  Help Us Grow
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                  This is a new website, so feel free to contact us about any features you'd like to see! 
                  Your feedback helps us build the best possible platform for students.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-3 py-2 sm:px-4 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share Your Ideas
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;