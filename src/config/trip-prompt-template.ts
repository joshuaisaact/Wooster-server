export const promptTemplate = `Generate **ONLY** a JSON itinerary for a {days}-day trip to **{location}**, starting on {start_date}. If you include any additional text outside the JSON it will break. Have no more than three activities per day. Exclude arrival, departure, check-in, and check-out. Include **only** the following fields for each activity: activity_name, description, location, price, latitude, longitude.

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
            "longitude": "{activity1_longitude}"
          }
        ]
      }
    ]
  }
]`;
