export const mockLLMDestinations = {
  tokyo: {
    destinationName: 'TEST_DESTINATION_TOKYO',

    latitude: '35.6762',
    longitude: '139.6503',
    description: 'A city where tradition meets modernity',
    country: 'Japan',
    bestTimeToVisit: ['Spring', 'Autumn'],
    averageTemperatureLow: '8',
    averageTemperatureHigh: '25',
    popularActivities: ['Visit Senso-ji', 'Explore Shibuya'],
    travelTips: ['Get a Pasmo card', 'Learn basic phrases'],
    nearbyAttractions: ['Mount Fuji', 'Kamakura'],
    transportationOptions: ['Metro', 'JR Trains', 'Bus'],
    accessibilityInfo: 'High',
    officialLanguage: 'Japanese',
    currency: 'JPY',
    localCuisine: ['Sushi', 'Ramen'],
    costLevel: 'High',
    safetyRating: 'High',
    culturalSignificance: 'High',
  },
  paris: {
    destinationName: 'TEST_DESTINATION_PARIS',

    latitude: '48.8566',
    longitude: '2.3522',
    description: 'The City of Light',
    country: 'France',
    bestTimeToVisit: ['Spring', 'Fall'],
    averageTemperatureLow: '8',
    averageTemperatureHigh: '25',
    popularActivities: ['Visit Eiffel Tower', 'Explore Louvre'],
    travelTips: ['Buy museum pass', 'Learn basic French'],
    nearbyAttractions: ['Versailles', 'Giverny'],
    transportationOptions: ['Metro', 'Bus', 'RER'],
    accessibilityInfo: 'High',
    officialLanguage: 'French',
    currency: 'EUR',
    localCuisine: 'Croissants, Coq au Vin',
    costLevel: 'High',
    safetyRating: 'High',
    culturalSignificance: 'High',
  },
  kerry: {
    destinationName: 'TEST_DESTINATION_KERRY',
    latitude: '52.0662',
    longitude: '-9.6737',
    description:
      "County Kerry, located in the southwest of Ireland, is renowned for its stunning natural beauty. From the majestic Ring of Kerry, a scenic coastal route, to the rugged peaks of the Macgillycuddy's Reeks, the county offers diverse landscapes.  Kerry is home to charming towns like Killarney, with its lakes and mountains, and Dingle, known for its vibrant harbor and the Dingle Peninsula, where the famous Fungie the dolphin once resided.",
    country: 'Ireland',
    bestTimeToVisit: 'May to September',
    averageTemperatureLow: '8',
    averageTemperatureHigh: '18',
    popularActivities:
      'Hiking, cycling, kayaking, exploring historic sites, attending traditional Irish music sessions, visiting charming towns, scenic drives',
    travelTips:
      'Rent a car to fully explore the county, pack for all weather conditions, consider a guided tour for the Ring of Kerry, learn some basic Irish phrases',
    nearbyAttractions:
      'Ring of Kerry, Killarney National Park, Dingle Peninsula, Skellig Michael, Gap of Dunloe, Muckross House and Gardens',
    transportationOptions: 'Car rental, public buses, ferries, trains',
    accessibilityInfo:
      'Accessibility varies depending on the specific location. Many attractions have wheelchair-accessible paths and facilities. Contact individual businesses and attractions for specific details.',
    officialLanguage: 'Irish, English',
    currency: 'Euro (€)',
    localCuisine:
      "Traditional Irish dishes like Irish stew, seafood, and soda bread. Local specialties include Dingle Bay mussels, Kerry lamb, and the famous 'Kerry Pie'.",
    costLevel: 'Medium',
    safetyRating: 'High',
    culturalSignificance:
      'Rich in Celtic history and culture, with ancient monuments like the Ringfort of Staigue and the monastic site of Glendalough. Known for its traditional music and storytelling, as well as its vibrant arts scene.',
    userRatings: '',
  },
};

export const mockDBDestinations = {
  tokyo: {
    ...mockLLMDestinations.tokyo,
    destinationId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  paris: {
    ...mockLLMDestinations.paris,
    destinationId: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  kerry: {
    ...mockLLMDestinations.kerry,
    destinationId: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};
