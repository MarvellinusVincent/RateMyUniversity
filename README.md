# Rate My University  
Rate My University is a web application designed to help students share their experiences at university. Users can rate various aspects of university life, such as campus facilities, classes, and social activities, and see how others have rated them. The app aims to provide insight into the overall student experience at different universities.  

## Features  
- Rate different aspects of university life  
- View overall ratings for various universities  
- Filter ratings by category (e.g., classes, campus, social life)  
- User authentication and personalized experience  

## Prerequisites  
Before running Rate My University on your local machine, ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)  
- [Git](https://git-scm.com/)  
- [React](https://reactjs.org/)  

## Installation  
1. Clone the repository:  
   `git clone https://github.com/yourusername/rate-my-university-life.git && cd rate-my-university-life`  
2. Install dependencies:  
   `npm install`  
3. Set up environment variables (if applicable):  
   - Create a `.env` file in the root directory  
   - Add the necessary environment variables (e.g., for API keys or backend URLs)  
4. Run the development server:  
   `npm start`  
5. Open your browser and go to:  
   `http://localhost:3000`  

## Usage  
1. Sign up or log in to your account.  
2. Rate different aspects of your university life.  
3. View and compare ratings with others.  

## Deployment  
To deploy the app, use a hosting service like Vercel, Netlify, or Firebase:  
`npm run build`  
Then, follow the deployment instructions for your chosen platform.  

## Contributing  
Contributions are welcome! Feel free to fork the repository and submit pull requests.  

## License  
This project is licensed under the MIT License.  

## Contact  
For any issues or suggestions, reach out via GitHub Issues or email at vmarvellinus@gmail.com. 

todo:
- Add delete review option for signed-in users
- Revamp mobile UI for better responsiveness


Additional functionalities not implemented:
- Clear login error when user leaves and re-enters the login page
- Require email verification before completing sign-up
- Fix oversized buttons on small mobile screens
