import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Privacy Policy - RateMyUniversity</title>
        <link rel="canonical" href="https://ratemyuniversity.io/privacy" />
        <meta name="description" content="Privacy Policy for RateMyUniversity - Learn how we collect, use, and protect your personal information" />
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-gray-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-gray-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/30 opacity-30"></div>
          
          <div className="relative p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-4">
              PRIVACY POLICY
            </h1>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  1. WHEN THIS PRIVACY POLICY APPLIES
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This is the privacy policy ("Privacy Policy") describing our privacy practices for the RateMyUniversity.io website, applications and other interactive services ("Site"). The Site is owned, operated and/or provided by RateMyUniversity, LLC ("RateMyUniversity," "we," "us," or "our").
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy applies regardless of whether you are accessing the Site via a personal computer, a mobile device or any other technology or devices now known or hereafter developed or discovered; whether you are accessing the Site as a registered user or other user of the Site; to all Information collected by the Site; and will remain in full force and effect even if your use of or participation in the Site or any particular service, feature, function or promotional activity offered through the Site terminates, expires, ceases, is suspended or deactivated for any reason.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  2. U.S. GOVERNING LAW
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Site is designed and targeted to U.S. audiences and is governed by and operated in accordance with the laws of the U.S. We make no representation that this Site is operated in accordance with the laws or regulations of, or governed by, other nations. If you are located outside of the U.S., you use this Site at your own risk and initiative and you, not us, are responsible for compliance with any applicable local and national laws. Please be aware that any Personal Information and Other Information you provide to us or we obtain as a result of your use of this Site shall be collected in the U.S. and/or transferred to the U.S. and subject to U.S. law.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  3. WHAT INFORMATION IS COLLECTED
                </h2>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  3.1 Information You Provide
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information that you provide directly to us when using our Site, including:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                  <li>Registration information (username, password, email address)</li>
                  <li>Profile information you choose to provide</li>
                  <li>University reviews and ratings you submit</li>
                  <li>Communications with us</li>
                  <li>Information provided when participating in promotions or surveys</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  3.2 Information Collected Automatically
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you access or use our Site, we automatically collect information about you, including:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Log information (IP address, browser type, access times, pages viewed)</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  4. HOW COLLECTED INFORMATION IS USED
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                  <li>Provide, maintain, and improve our Site and services</li>
                  <li>Create and manage your account</li>
                  <li>Process and display your university reviews and ratings</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Communicate with you about products, services, offers, and events</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our Site</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Personalize your experience and provide content and features that match your interests</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  5. SHARING OF INFORMATION
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                  <li>When you choose to make your reviews or profile information public</li>
                  <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                  <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of RateMyUniversity or others</li>
                  <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  6. ADVERTISING AND ANALYTICS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may allow others to provide analytics services and serve advertisements on our behalf across the web and in mobile applications. These entities may use cookies, web beacons, device identifiers, and other technologies to collect information about your use of our Site and other websites and applications.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This information may be used by RateMyUniversity and others to, among other things, analyze and track data, determine the popularity of certain content, deliver advertising and content targeted to your interests on our Site and other websites, and better understand your online activity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  7. YOUR CHOICES
                </h2>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  7.1 Account Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may update, correct, or delete information about you at any time by logging into your online account or emailing us at ratemyuniversitymv@gmail.com. If you wish to delete or deactivate your account, please note that we may retain certain information as required by law or for legitimate business purposes.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  7.2 Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Site.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  8. DATA RETENTION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  9. SECURITY
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee its absolute security.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  10. CALIFORNIA PRIVACY RIGHTS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  California law provides residents with additional rights regarding our use of their personal information. If you are a California resident, you have the right to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                  <li>Request information about the categories and specific pieces of personal information we have collected about you</li>
                  <li>Request information about our disclosure of personal information for business purposes</li>
                  <li>Request that we delete your personal information</li>
                  <li>Opt out of the sale of your personal information, if applicable</li>
                  <li>Not be discriminated against for exercising these rights</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  To exercise these rights, please contact us at ratemyuniversitymv@gmail.com. We will need to verify your identity before processing your request.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  11. CHANGES TO THIS PRIVACY POLICY
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification). We encourage you to review the Privacy Policy whenever you access our Site to stay informed about our information practices and the choices available to you.
                </p>
              </div>

              <p className="text-sm text-gray-500 text-center mb-8">
                Last Updated: September 1, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;