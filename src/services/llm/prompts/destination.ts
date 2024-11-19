export const destinationPromptTemplate = (destination: string) => `
Generate **ONLY** a valid JSON object for the destination ${destination}. That means **NO ARRAYS**. Temperature will be stored as a **NUMBER**. If you include any additional text outside the JSON it will break. **DO NOT** include the destinationId field in your output.

Include **only** the following fields for each destination:

- "destinationName": string
- "latitude": number (in decimal degrees, e.g., 40.7128)
- "longitude": number (in decimal degrees, e.g., -74.0060)
- "description": string (between 50 and 200 words)
- "country": string (use official country names)
- "bestTimeToVisit": string[] (max 2 values, use months or seasons, e.g., ["June to August", "December to February"])
- "averageTemperatureLow": number (in Celsius, use average of the lowest monthly temperatures)
- "averageTemperatureHigh": number (in Celsius, use average of the highest monthly temperatures)
- "popularActivities": string[] (max 5 activities, each activity should be 1 to 5 words)
- "travelTips": string[] (max 3 tips, each tip should be 10 to 30 words)
- "nearbyAttractions": string[] (max 3 attractions, each attraction should be 2 to 7 words)
- "transportationOptions": string[] (max 3 options, e.g., ["Rental Car", "Public Bus", "Taxi"])
- "accessibilityInfo": "Low" | "Moderate" | "High" (consider factors like infrastructure, accommodations, and services)
- "officialLanguage": string (use the most widely spoken official language)
- "currency": string (ISO 4217 code, e.g., "USD", "EUR")
- "localCuisine": string[] (max 3 cuisines, each cuisine should be 1 to 4 words)
- "costLevel": "Low" | "Medium" | "High" (relative to other tourist destinations)
- "safetyRating": "Low" | "Moderate" | "High" (based on official travel advisories and crime rates)
- "culturalSignificance": "Low" | "Moderate" | "High" (consider historical, artistic, and cultural aspects)

**DO NOT** include a "userRatings" field.
`;
