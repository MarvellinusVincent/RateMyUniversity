import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenError("Invalid or missing reset token. Please request a new password reset link.");
        return;
      }
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/validateResetToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          setTokenValid(false);
          setTokenError(data.error || "This reset link has expired. Please request a new one.");
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        setTokenError("Unable to validate reset link. Please try again or request a new link.");
      }
    };
    
    validateToken();
  }, [token]);

  useEffect(() => {
    if (newPassword || confirmPassword) {
      setError(null);
      setMessage(null);
    }
  }, [newPassword, confirmPassword]);

  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    const strengthPoints = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;
  
    return {
      strength: strengthPoints,
      requirements: {
        length: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    const { strength } = checkPasswordStrength(newPassword);
    if (strength < 3) {
      setError("Password must meet at least 3 complexity requirements: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword, 
          confirmPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setPasswordReset(true);
        setNewPassword("");
        setConfirmPassword("");
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        if (response.status === 400) {
          setError(data.error || "Invalid request. Please check your information and try again.");
        } else {
          setError(data.error || "An error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/30">
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Validating Reset Link</h2>
            <p className="text-sm sm:text-base text-gray-600">Please wait while we verify your password reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden flex items-center justify-center p-4">
        <Helmet>
          <title>Invalid Reset Link - RateMyUniversity</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/30">
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Reset Link Expired</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">{tokenError}</p>
            <div className="space-y-3">
              <Link 
                to="/forgotPassword"
                className="inline-block w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Request New Reset Link
              </Link>
              <Link 
                to="/login"
                className="inline-block w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      <Helmet>
        <title>Reset Your Password - RateMyUniversity</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Create a new password for your RateMyUniversity account." />
      </Helmet>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-blue-200 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-l from-cyan-200 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-blue-100 to-transparent opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/30">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <Link 
              to="/login" 
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-blue-500"
              title="Back to login"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </Link>
          </div>
          
          <div className="p-5 sm:p-8 md:p-10">
            <div className="relative mb-6 sm:mb-8 text-center">
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-blue-400/20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-cyan-400/20 blur-xl"></div>
              
              {!passwordReset ? (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 relative z-10">
                    Reset Password
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 relative z-10">
                    Enter your new password below
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 relative z-10">
                    Password Reset!
                  </h2>
                </>
              )}
            </div>

            {!passwordReset ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="relative bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-xs sm:text-sm text-red-700 flex-1 min-w-0 break-words">
                        {error}
                      </div>
                      <button
                        onClick={() => setError("")}
                        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors ml-2"
                        aria-label="Close error message"
                      >
                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-blue-800/90">New Password</label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-white/80 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-blue-300/70 disabled:opacity-50"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            checkPasswordStrength(newPassword).strength >= 4 ? 'bg-green-500' : 
                            checkPasswordStrength(newPassword).strength >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${(checkPasswordStrength(newPassword).strength / 5) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-blue-800/90">Confirm New Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-white/80 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-blue-300/70 disabled:opacity-50"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                        newPassword === confirmPassword ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-xs ${
                        newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !newPassword.trim() || !confirmPassword.trim()}
                  className="w-full py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600 transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                  <p className="mb-4">You will be redirected to the login page in a few seconds.</p>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Go to Login
                </button>
              </div>
            )}

            {!passwordReset && (
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

export default ResetPassword;