import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('account');

  const faqData = {
    account: [
      {
        question: "Do I need to create an account to leave a review?",
        answer: "No, you can leave reviews without creating an account. However, creating an account allows you to track your reviews, and engage with other features like liking/disliking reviews"
      },
      {
        question: "What's the difference between posting with and without an account?",
        answer: "When posting without an account, your review will be anonymous. With an account, your username will be displayed with your review, and you'll be able to manage your reviews from your profile"
      },
      {
        question: "Can I change my review from anonymous to named (or vice versa) later?",
        answer: "If you posted anonymously, you cannot later attach it to an account. If you posted with an account, you cannot make it anonymous later. We recommend creating an account if you think you might want to manage your reviews in the future"
      },
      {
        question: "Is my personal information kept private?",
        answer: "Yes, we take privacy seriously. Your email and personal details are never shared publicly. Only your username (if you choose to post with an account) is displayed with your reviews"
      }
    ],
    reviews: [
      {
        question: "Are there any guidelines for what I can write in reviews?",
        answer: "We encourage honest, constructive feedback about your university experience. Please avoid personal attacks, offensive language, or false information. See our Community Guidelines for more details"
      },
      {
        question: "How do you prevent fake reviews?",
        answer: "We use several methods to maintain review authenticity, including automated detection systems, user reporting features, and manual moderation when necessary"
      },
      {
        question: "Can I review multiple aspects of my university separately?",
        answer: "Yes, our review system allows you to rate different aspects of your university experience, including academics, campus life, facilities, and more"
      },
      {
        question: "What happens if my review gets reported?",
        answer: "If a review is reported, our moderation team will assess it against our community guidelines. Reviews that violate our policies may be removed, and repeated violations may lead to account suspension if logged in"
      }
    ],
    features: [
      {
        question: "How do likes work and who can see them?",
        answer: "Likes help indicate how helpful a review is to other users. The count is visible to everyone, but who liked/disliked a specific review is not shown to maintain privacy"
      },
      {
        question: "Can I save reviews from other users?",
        answer: "No, you cannot save reviews from other users. However, if you log in and leave a review, you will be able to view and manage your own review."
      },
      {
        question: "How are universities ranked or sorted?",
        answer: "Universities are sorted by default based on a combination of factors including review recency, rating scores, and number of reviews"
      }
    ],
    technical: [
      {
        question: "My university isn't listed - how do I request it be added?",
        answer: "If your university isn't listed, simply search for its name in the search bar. You'll see an 'Add Your School' button appear where clicking it will redirect you to a form where you can submit your university. Alternatively, you can contact us at ratemyuniversitymv@gmail.com. We regularly add new universities based on user requests"
      },
      {
        question: "I'm having trouble logging in",
        answer: "If you're having login issues, first try resetting your password. If that doesn't work, ensure you're using the correct email address. For persistent issues, contact our support team"
      },
      {
        question: "Why can't I see my saved reviews?",
        answer: "Saved reviews are only available when you're logged in. Make sure you're signed into the correct account. If the issue persists, try refreshing the page or clearing your browser cache"
      },
      {
        question: "How do I reset my password?",
        answer: "Click on the 'Forgot Password' link on the login page and enter your email address. You'll receive instructions to reset your password shortly"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Frequently Asked Questions - RateMyUniversity</title>
        <link rel="canonical" href="https://ratemyuniversity.io/faq" />
        <meta name="description" content="Find answers to common questions about RateMyUniversity - account management, reviews, features, and technical support" />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          
          <div className="relative flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200/50 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">FAQ Categories</h2>
              <nav className="space-y-1.5 sm:space-y-2">
                <button
                  onClick={() => setActiveCategory('account')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base ${
                    activeCategory === 'account' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Account & Privacy
                </button>
                <button
                  onClick={() => setActiveCategory('reviews')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base ${
                    activeCategory === 'reviews' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Reviews & Content
                </button>
                <button
                  onClick={() => setActiveCategory('features')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base ${
                    activeCategory === 'features' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Features & Functionality
                </button>
                <button
                  onClick={() => setActiveCategory('technical')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base ${
                    activeCategory === 'technical' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Technical Support
                </button>
              </nav>
              
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-1.5 sm:mb-2 text-sm sm:text-base">Still need help?</h3>
                <p className="text-blue-600 text-xs sm:text-sm mb-2 sm:mb-3">Can't find the answer you're looking for?</p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-xs sm:text-sm text-blue-700 font-medium hover:text-blue-800"
                >
                  Contact our support team
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-1.5 sm:mb-2">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Find answers to common questions about RateMyUniversity</p>
              
              <div className="space-y-4 sm:space-y-6">
                {faqData[activeCategory].map((item, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/50 shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-start">
                      <div className="bg-blue-100 p-1 rounded-lg mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="flex-1">{item.question}</span>
                    </h3>
                    <p className="text-gray-700 pl-7 sm:pl-9 text-sm sm:text-base">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;