import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Terms of Service - RateMyUniversity</title>
        <link rel="canonical" href="https://ratemyuniversity.io/terms" />
        <meta name="description" content="Terms of Service for RateMyUniversity - Legal agreement governing use of our university rating platform" />
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
              TERMS OF SERVICE
            </h1>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  1. AGREEMENT TO TERMS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  THESE TERMS OF USE CONTAIN AN ARBITRATION CLAUSE AND A CLASS ACTION WAIVER CLAUSE. 
                  BY USING THIS SITE, YOU ARE ACCEPTING THE TERMS OF USE AND, WHILE YOU MAY STILL PURSUE 
                  CLAIMS AGAINST US, WITH A FEW EXCEPTIONS, YOU ARE AGREEING THAT YOU MUST PURSUE YOUR 
                  CLAIMS IN A BINDING ARBITRATION PROCEEDING (AND NOT IN A COURT) AND ONLY ON AN INDIVIDUAL 
                  (AND NOT A CLASS ACTION) BASIS.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This is the official Terms of Use Agreement ("Agreement") for the RateMyUniversity.io website, 
                  application or other interactive service ("Site"). This Agreement describes your rights and 
                  responsibilities relating to the Site and is a legally binding agreement between you and 
                  RateMyUniversity, LLC ("RateMyUniversity," "we," "us," or "our").
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  2. ELIGIBILITY
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You must reside in or attend, have attended or teach 
                  at a university to use this Site. If you are not yet the required age, do not meet these requirements, 
                  or do not agree with all of the terms and conditions contained in this Agreement, please discontinue 
                  using the Site immediately.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using or attempting to use the Site, you certify that you 
                  meet all eligibility requirements, and agree to all of the terms and conditions of this Agreement.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  3. INTELLECTUAL PROPERTY RIGHTS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unless otherwise indicated, the Site is our proprietary property and all source code, databases, 
                  functionality, software, website designs, audio, video, text, photographs, and graphics on the 
                  Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein 
                  (the "Marks") are owned or controlled by us or licensed to us.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The Content and Marks are provided on the Site "AS IS" for your information and personal use only. 
                  Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may 
                  be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, 
                  translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial 
                  purpose whatsoever, without our express prior written permission.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  4. USER REPRESENTATIONS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using the Site, you represent and warrant that:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>All registration information you submit will be true, accurate, current, and complete</li>
                  <li>You will maintain the accuracy of such information and promptly update such registration information as necessary</li>
                  <li>You have the legal capacity and you agree to comply with these Terms of Use</li>
                  <li>You will not access the Site through automated or non-human means</li>
                  <li>You will not use the Site for any illegal or unauthorized purpose</li>
                  <li>Your use of the Site will not violate any applicable law or regulation</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  5. PROHIBITED ACTIVITIES
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may not access or use the Site for any purpose other than that for which we make the Site available. 
                  The Site may not be used in connection with any commercial endeavors except those that are specifically 
                  endorsed or approved by us.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a user of the Site, you agree not to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us</li>
                  <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email</li>
                  <li>Use the Site to advertise or offer to sell goods and services</li>
                  <li>Circumvent, disable, or otherwise interfere with security-related features of the Site</li>
                  <li>Engage in unauthorized framing of or linking to the Site</li>
                  <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information</li>
                  <li>Make improper use of our support services or submit false reports of abuse or misconduct</li>
                  <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools</li>
                  <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site</li>
                  <li>Attempt to impersonate another user or person or use the username of another user</li>
                  <li>Sell or otherwise transfer your profile</li>
                  <li>Use any information obtained from the Site in order to harass, abuse, or harm another person</li>
                  <li>Use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise</li>
                  <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site</li>
                  <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site</li>
                  <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you</li>
                  <li>Delete the copyright or other proprietary rights notice from any Content</li>
                  <li>Copy or adapt the Site's software, including but not limited to Flash, PHP, HTML, JavaScript, or other code</li>
                  <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site</li>
                  <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Site, or using or launching any unauthorized script or other software</li>
                  <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site</li>
                  <li>Use the Site in a manner inconsistent with any applicable laws or regulations</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  6. CONTRIBUTION LICENSE
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By posting your Contributions to any part of the Site, you automatically grant, and you represent 
                  and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, 
                  non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, 
                  reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, 
                  publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such 
                  Contributions (including, without limitation, your image and voice) for any purpose, commercial, 
                  advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, 
                  such Contributions, and grant and authorize sublicenses of the foregoing.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This license will apply to any form, media, or technology now known or hereafter developed, and 
                  includes our use of your name, company name, and franchise name, as applicable, and any of the 
                  trademarks, service marks, trade names, logos, and personal and commercial images you provide. 
                  You waive all moral rights in your Contributions, and you warrant that moral rights have not 
                  otherwise been asserted in your Contributions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  7. SUBMISSIONS
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other 
                  information regarding the Site ("Submissions") provided by you to us are non-confidential and 
                  shall become our sole property. We shall own exclusive rights, including all intellectual property 
                  rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for 
                  any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  8. SITE MANAGEMENT
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right, but not the obligation, to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Monitor the Site for violations of these Terms of Use</li>
                  <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Use, including without limitation, reporting such user to law enforcement authorities</li>
                  <li>In our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof</li>
                  <li>In our sole discretion and without limitation, notice, or liability, to remove from the Site or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems</li>
                  <li>Otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  9. COPYRIGHT INFRINGEMENTS
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We respect the intellectual property rights of others. If you believe that any material available 
                  on or through the Site infringes upon any copyright you own or control, please immediately notify 
                  us using the contact information provided below (a "Notification"). A copy of your Notification 
                  will be sent to the person who posted or stored the material addressed in the Notification.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  10. TERM AND TERMINATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Use shall remain in full force and effect while you use the Site. WITHOUT LIMITING 
                  ANY OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND 
                  WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP 
                  ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH 
                  OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF USE OR OF ANY APPLICABLE 
                  LAW OR REGULATION.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  11. MODIFICATIONS AND INTERRUPTIONS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to change, modify, or remove the contents of the Site at any time or for any 
                  reason at our sole discretion without notice. However, we have no obligation to update any information 
                  on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice 
                  at any time.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We will not be liable to you or any third party for any modification, price change, suspension, 
                  or discontinuance of the Site.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  12. GOVERNING LAW
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Use and your use of the Site are governed by and construed in accordance with the 
                  laws of the State of New York applicable to agreements made and to be entirely performed within 
                  the State of New York, without regard to its conflict of law principles.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  13. DISCLAIMER
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND 
                  OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL 
                  WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT 
                  LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
                  NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE'S CONTENT 
                  OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY 
                  FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR 
                  PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE, 
                  (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION 
                  AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO 
                  OR FROM THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR 
                  THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS 
                  OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, 
                  TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  14. LIMITATIONS OF LIABILITY
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR 
                  ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING 
                  LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN 
                  IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE 
                  WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT 
                  PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  15. INDEMNIFICATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, 
                  and all of our respective officers, agents, partners, and employees, from and against any loss, 
                  damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by 
                  any third party due to or arising out of: (1) your Contributions; (2) use of the Site; (3) breach 
                  of these Terms of Use; (4) any breach of your representations and warranties set forth in these 
                  Terms of Use; (5) your violation of the rights of a third party, including but not limited to 
                  intellectual property rights; or (6) any overt harmful act toward any other user of the Site 
                  with whom you connected via the Site.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  16. USER DATA
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We will maintain certain data that you transmit to the Site for the purpose of managing the 
                  performance of the Site, as well as data relating to your use of the Site. Although we perform 
                  regular routine backups of data, you are solely responsible for all data that you transmit or that 
                  relates to any activity you have undertaken using the Site. You agree that we shall have no liability 
                  to you for any loss or corruption of any such data, and you hereby waive any right of action against 
                  us arising from any such loss or corruption of such data.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  17. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Visiting the Site, sending us emails, and completing online forms constitute electronic communications. 
                  You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, 
                  and other communications we provide to you electronically, via email and on the Site, satisfy any legal 
                  requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, 
                  CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF 
                  TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  18. MISCELLANEOUS
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms of Use and any policies or operating rules posted by us on the Site or in respect to 
                  the Site constitute the entire agreement and understanding between you and us. Our failure to exercise 
                  or enforce any right or provision of these Terms of Use shall not operate as a waiver of such right 
                  or provision.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We may assign any or all of our rights and obligations to others at any time. We shall not be 
                  responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond 
                  our reasonable control. If any provision or part of a provision of these Terms of Use is determined 
                  to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable 
                  from these Terms of Use and does not affect the validity and enforceability of any remaining provisions.
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

export default TermsOfService;