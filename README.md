# Fitness Journal

A comprehensive fitness tracking web application built with React. Track your workouts, weight, heart rate zones, and calculate your TDEE and goal weight timeline.

## Features

- Weight tracking with history
- TDEE (Total Daily Energy Expenditure) calculator
- Goal weight calculator with different deficit scenarios
- Heart rate zone calculator
- Exercise tracking
- Unit conversion (Metric/Imperial)
- Contact form with EmailJS integration
- Responsive design
- Local storage persistence

## Tech Stack

- React
- React Router for navigation
- EmailJS for contact form
- CSS3
- Local Storage for data persistence

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Set up EmailJS Configuration
- Copy `src/config/emailjs.example.js` to `src/config/emailjs.js`
- Sign up for an account at [EmailJS](https://www.emailjs.com)
- Create an Email Service and Template
- Replace the placeholder values in `emailjs.js` with your credentials:
  - `YOUR_SERVICE_ID`: Your EmailJS service ID
  - `YOUR_TEMPLATE_ID`: Your EmailJS template ID
  - `YOUR_PUBLIC_KEY`: Your EmailJS public key

4. Start the development server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
  ├── components/         # React components
  ├── context/           # React context providers
  ├── pages/             # Page components
  │   ├── Landing.js     # Home page
  │   ├── Contact.js     # Contact form
  │   ├── Formulas.js    # Fitness calculators
  │   └── ...
  ├── config/            # Configuration files
  │   ├── emailjs.js     # EmailJS credentials (not tracked in Git)
  │   └── emailjs.example.js  # Example configuration
  ├── App.js            # Main application component
  ├── App.css           # Global styles
  └── index.js          # Application entry point
```

## Features Overview

### Weight Tracking
- Record and monitor weight progress
- View weight history with dates
- Delete individual entries
- Automatic unit conversion (kg/lbs)

### Exercise Tracking
- Log exercises with sets, reps, and notes
- View exercise history
- Delete exercise entries

### Fitness Calculators
- TDEE Calculator: Calculate daily calorie needs
- Goal Weight Calculator: Plan weight loss/gain timeline
- Heart Rate Zones: Calculate training zones

### Contact Form
- Send feedback or suggestions
- Integrated with EmailJS for email delivery
- Form validation and error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Note

The application uses EmailJS for the contact form functionality. To ensure security:

1. Never commit sensitive credentials to version control
2. Keep your `.env` file private and never share it
3. Use environment variables for all sensitive information
4. The following files should never be committed:
   - `.env`
   - `src/config/emailjs.js`

### Setting up EmailJS

1. Copy `src/config/emailjs.example.js` to `src/config/emailjs.js`
2. Create a `.env` file in the project root with these variables:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```
3. Replace the placeholder values with your actual EmailJS credentials
4. Restart the development server after making these changes 

## Deployment

### Production Build
1. Create a production build:
```bash
npm run build
```

2. The build folder will be created with optimized production files.

### Environment Variables
For production deployment, set these environment variables on your hosting platform:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### Deployment Options
1. Static Hosting (e.g., Netlify, Vercel, GitHub Pages):
   - Connect your repository
   - Set environment variables
   - Deploy the build folder

2. Traditional Hosting:
   - Upload the contents of the build folder to your server
   - Configure your server to serve index.html for all routes
   - Set up environment variables on your server

### Testing Production Build
To test the production build locally:
```bash
npm install -g serve
serve -s build
``` 