import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: "About Us", path: "/about" },
    { name: "Community Guidelines", path: "/guidelines" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Copyright Policy", path: "/copyright" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-full max-w-3xl">
            <div className="text-center">
              <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 sm:pt-4 pb-1 sm:pb-2">
          <div className="text-center space-y-1.5 sm:space-y-2">
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              🚀 This is a new website — feel free to <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link> with any features you'd like to see!
            </p>
            <p className="text-gray-500 text-xs">
              © {currentYear} Rate My University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;