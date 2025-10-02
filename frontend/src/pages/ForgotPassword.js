import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (email) {
      setError(null);
      setMessage(null);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("If an account with that email exists, we've sent you a password reset link. Please check your email and spam folder.");
        setEmailSent(true);
        setEmail("");
      } else {
        if (response.status === 404) {
          setError("No account found with that email address.");
        } else if (response.status === 429) {
          setError("Too many requests. Please try again later.");
        } else {
          setError(data.message || "An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      <Helmet>
        <title>Reset Your Password - RateMyUniversity</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Reset your password for RateMyUniversity. Enter your email to receive password reset instructions." />
      </Helmet>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-r from-blue-200 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-l from-cyan-200 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-blue-100 to-transparent opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-3 sm:p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/30">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <Link 
              to="/login" 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-blue-500"
              title="Back to login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </Link>
          </div>
          
          <div className="p-5 sm:p-6 md:p-10">
            <div className="relative mb-6 sm:mb-8 text-center">
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-blue-400/20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-cyan-400/20 blur-xl"></div>
              
              {!emailSent ? (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 relative z-10">
                    Reset Password
                  </h2>
                  <p className="text-gray-600 mt-2 relative z-10 text-sm sm:text-base px-2">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 relative z-10">
                    Check Your Email
                  </h2>
                </>
              )}
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="mx-auto max-w-full p-3 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg break-words">
                    <div className="flex items-start">
                      <svg 
                        className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-blue-800/90">Email Address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/80 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-blue-300/70 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !email.trim()}
                  className="w-full py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600 transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="mx-auto max-w-full p-3 sm:p-4 text-xs sm:text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <svg 
                      className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <span>{message}</span>
                  </div>
                </div>

                <div className="text-center text-gray-600 text-sm sm:text-base">
                  <p className="mb-3 sm:mb-4 px-2">Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setMessage(null);
                      setError(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4 transition-colors duration-200 text-sm sm:text-base"
                  >
                    Try a different email
                  </button>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Login
                </button>
              </div>
            )}

            {!emailSent && (
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-xs sm:text-sm text-blue-600/90">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-blue-700 hover:text-blue-800 transition-colors duration-200 underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;