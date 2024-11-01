export const createPrompt = (
  days: number,
  location: string,
  startDate: string,
): string => `
Generate **ONLY** a JSON itinerary for a ${days}-day trip to **${location}**, starting on ${startDate}. If you include any additional text outside the JSON it will break. Have no more than three activities per day. Exclude arrival, departure, check-in, and check-out.

Duration must be in format "X hours" or "X.5 hours".
Difficulty must be one of: "Easy", "Moderate", "Challenging".
Category must be one of: "Adventure", "Cultural", "Nature", "Food & Drink", "Shopping", "Entertainment".
Best time must be one of: "Early Morning", "Morning", "Afternoon", "Evening", "Night", "Any Time".
Price must be in format "$X" where X is a number.

[
  {
     [
      {
        "day": 1,
        "activities": [
          {
            "activityName": "{activity1_name}",
            "description": "{activity1_description}",
            "location": "{activity1_location}",
            "price": "{activity1_price}",
            "latitude": "{activity1_latitude}",
            "longitude": "{activity1_longitude}",
            "duration": "{activity1_duration}",
            "difficulty": "{activity1_difficulty}",
            "category": "{activity1_category}",
            "bestTime": "{activity1_bestTime}"
          }
        ]
      }
    ]
  }
]`;
