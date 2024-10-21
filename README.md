<div align="center">
<h2> Wooster Server </h2>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Backend for AI-Powered Trip Planning App

Wooster Server is the backend service for the Wooster AI-powered trip planning application. It is built using **Express** and **TypeScript**, and integrates with **Google's Gemini API** for AI services and **Supabase** for database storage. The backend manages trip and destination data, providing API routes for creating, managing, and retrieving trip itineraries and destination details.

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

</div>

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [API Routes](#api-routes)
- [Utilities](#utilities)
- [License](#license)

## Getting Started

To get the backend server up and running, follow these steps:

### Prerequisites

1. **Google Gemini API Key**: You will need to generate your own Google Gemini API key to use AI features.
2. **Supabase Database**: Create a Supabase account and set up a database to manage your trip and destination data.

### Environment Variables

You will need to create a `.env` file at the root of the project with the following environment variables:

```bash

# .env
PORT=your_port_number
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_api_key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key

PROMPT_TEMPLATE = `Generate **ONLY** a JSON itinerary for a {days}-day trip to **{location}**, starting on {start_date}. If you include any additional text outside the JSON it will break. Have no more than three activities per day. Exclude arrival, departure, check-in, and check-out. Include **only** the following fields for each activity: activity_name, description, location, price, latitude, longitude.

[
  {
     [
      {
        "day": 1,
        "activities": [
          {
            "activity_name": "{activity1_name}",
            "description": "{activity1_description}",
            "location": "{activity1_location}",
            "price": "{activity1_price}",
            "latitude": "{activity1_latitude}",
            "longitude": "{activity1_longitude}",
          },
          { /* ... other activities */ }
        ]
      },
      { /* ... other days */ }
    ]
  }
]`;

DESTINATION_PROMPT_TEMPLATE = `Generate **ONLY** a valid JSON object for {destination}. That means **NO ARRAYS**. **DO NOT** include a user_ratings field. Temperature will be stored as a **NUMBER**. If you include any additional text outside the JSON it will break. **DO NOT** include the destination_id field in your output. Include **only** the following fields for each destination: destination_name, latitude, longitude, description, country, created_at, best_time_to_visit, average_temperature_low, average_temperature_high, popular_activities, travel_tips, nearby_attractions, transportation_options, accessibility_info, official_language, currency, local_cuisine, user_ratings, cost_level, safety_rating, and cultural_significance. Make sure all keys are in double quotes and use double quotes for string values. Format lists as comma-separated strings without brackets. Here is an example:

{
    "destination_name": "New York City",
    "latitude": 40.712776,
    "longitude": -74.005974,
    "description": "The largest city in the United States, known for its iconic landmarks and cultural diversity.",
    "country": "USA",
    "created_at": "2024-09-20T20:57:39.74403+00:00",
    "best_time_to_visit": "April to June",
    "average_temperature_low": 40.0,
    "average_temperature_high": 75.0,
    "accessibility_info": "Mostly accessible.",
    "official_language": "English",
    "currency": "USD",
    "local_cuisine": "Pizza, bagels",
    "cost_level": "Moderate",
    "safety_rating": 4.0,
    "cultural_significance": "A melting pot of cultures."
}

return only valid JSON`;
```

Replace `your_port_number`, `your_supabase_project_url`, `your_supabase_api_key`, and `your_google_gemini_api_key` with your actual credentials.

### Installation

1. Clone the repository:

   ```bash

   git clone https://github.com/your-username/wooster-server.git
   ```

2. Navigate to the project directory:

   ```bash

   cd wooster-server
   ```

3. Install dependencies:

   ```bash

   npm install
   ```

4. Start the server:

   ```bash

   npm start
   ```

The server will start on the port specified in your `.env` file.

## API Routes

Here are the available API routes in the application:

### Auth Routes

- **`POST /auth/register`**: Register a new user.
- **`POST /auth/login`**: Login an existing user.
- **`POST /auth/logout`**: Logout the current user (requires authentication).

### Trip Routes

- **`GET /trips`**: Fetch all trips from the Supabase database.
- **`POST /trip`**: Save a new trip to the Supabase database.
- **`DELETE /trips/:tripId`**: Delete a trip by its ID from the Supabase database.

### Destination Routes

- **`GET /destinations`**: Fetch a list of all destinations.
- **`GET /destinations/:destinationId`**: Fetch detailed information about a specific destination by ID.
- **`POST /destination`**: Add a new destination to the Supabase database.
- **`DELETE /destinations/:destinationId`**: Remove a destination by its ID from the Supabase database.

## Utilities

The server includes a utility function to reshape the trip data fetched from Supabase into a format suitable for front-end consumption. The function `reshapeTripData` converts the raw database data into a format where trips are nested with their associated activities and days:

```typescript
function reshapeTripData(dbData: any) {
  return dbData.map((trip: any) => ({
    trip_id: trip.trip_id.toString(),
    start_date: trip.start_date,
    num_days: trip.num_days,
    destination_name: trip.destinations.destination_name,
    itinerary: convertActivities(trip.itinerary_days),
  }));
}
```

The helper function `convertActivities` structures the activities by day:

```typescript
function convertActivities(data: any) {
  const result: any[] = [];

  data.forEach((item: any) => {
    const { day_number, activities } = item;
    const dayEntry = result.find((entry) => entry.day === day_number);

    if (dayEntry) {
      dayEntry.activities.push({
        activity_id: activities.activity_id,
        activity_name: activities.activity_name,
        description: activities.description,
        location: activities.location,
        price: activities.price,
        latitude: activities.latitude,
        longitude: activities.longitude,
      });
    } else {
      result.push({
        day: day_number,
        activities: [
          {
            activity_id: activities.activity_id,
            activity_name: activities.activity_name,
            description: activities.description,
            location: activities.location,
            price: activities.price,
            latitude: activities.latitude,
            longitude: activities.longitude,
          },
        ],
      });
    }
  });

  return result;
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
