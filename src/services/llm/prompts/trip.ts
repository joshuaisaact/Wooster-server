export const tripPromptTemplate = (
  days: number,
  location: string,
  startDate: string,
  selectedCategories?: string[],
): string => `
  Generate **only** JSON data using the format specified below, and ensure it is complete, valid JSON without any text outside the JSON structure.
Generate **ONLY** a JSON itinerary for a ${days}-day trip to **${location}**, starting on ${startDate}. If you include any additional text outside the JSON it will break. Have no more than three activities per day. Exclude arrival, departure, check-in, and check-out.

Duration must be in format "X hours" or "X.5 hours".
Difficulty must be one of: "Easy", "Moderate", "Challenging".
Category must be one of: "Adventure", "Cultural", "Nature", "Food & Drink", "Shopping", "Entertainment".
Best time must be one of: "Early Morning", "Morning", "Afternoon", "Evening", "Night", "Any Time".
Price must be in format "$X" where X is a number.
Latitude and longitude should be in decimal degrees (e.g., 40.7128, -74.0060).

${
  selectedCategories && selectedCategories.length > 0
    ? `Focus on activities in the following categories: ${selectedCategories.join(', ')}.`
    : ''
}

Use the following JSON structure:
[
  {
    "day": 1,
    "activities": [
      {
        "activityName": string,
        "description": string (between 20 and 50 words),
        "location": string,
        "price": string,
        "latitude": number,
        "longitude": number,
        "duration": string,
        "difficulty": "Easy" | "Moderate" | "Challenging",
        "category": "Adventure" | "Cultural" | "Nature" | "Food & Drink" | "Shopping" | "Entertainment",
        "bestTime": "Early Morning" | "Morning" | "Afternoon" | "Evening" | "Night" | "Any Time",
        "bookingRequired": boolean,
      },
      ...
    ]
  },
  ...
]
`;
