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
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          
          <div className="relative p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6 text-center">
              About RateMyUniversity
            </h1>
            
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  To provide a transparent website where students can share authentic experiences about their universities, 
                  helping future students make informed decisions about their education journey
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  RateMyUniversity was created by a student who realized there was no dedicated website 
                  to comprehensively rate and review universities. While sites like Rate My Professors 
                  included some university ratings, there wasn't a website focused solely on the university itself
                </p>
                <p className="text-gray-700">
                  This website was built to fill that gap. It's a place where you can review every part of your university experience.
                  Feel free to leave your reviews and share your true feelings about the university you attended. Your honest opinion helps 
                  other students see what the school they're interested in is really like
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <span className="text-blue-600 text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Authenticity</h3>
                      <p className="text-gray-600 text-sm">Real reviews from real students</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Transparency</h3>
                      <p className="text-gray-600 text-sm">Honest, unfiltered experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <span className="text-purple-600 text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Community</h3>
                      <p className="text-gray-600 text-sm">Students helping students</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                      <span className="text-yellow-600 text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Empowerment</h3>
                      <p className="text-gray-600 text-sm">Helping you make informed choices</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  Help Us Grow
                </h2>
                <p className="text-gray-700 mb-3">
                  This is a new website, so feel free to contact us about any features you'd like to see! 
                  Your feedback helps us build the best possible platform for students.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share Your Ideas
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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