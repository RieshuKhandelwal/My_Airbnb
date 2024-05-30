# My Airbnb

This repository contains an Airbnb-like application built using Node.js, Express, and MongoDB. It allows users to view listings, leave reviews, and manage their profiles.

## Getting Started

1. Clone this repository to your local machine.
2. Install the required dependencies by running:

npm install

3. Set up your environment variables by creating a `.env` file in the root directory. Add the following variables:

NODE_ENV=development ATLASDB_URL=<MongoDB Atlas connection URL> SECRET=<your session secret>

4. Start the server by running:

npm start

5. Open your browser and navigate to http://localhost:8080.

## Features

- User authentication using Passport.js
- Session management with Express sessions and MongoDB store
- Error handling middleware
- Listing and review routes
- Flash messages for success and error notifications

## Routes

- `/listings`: View all listings
- `/listings/:id/reviews`: View reviews for a specific listing
- `/`: Redirects to the listings page

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
