export const mockLLMTrips = {
  tokyo: [
    {
      day: 1,
      activities: [
        {
          activityName: 'Visit the Tokyo National Museum',
          description:
            "Explore Japan's oldest and largest museum, showcasing historical artifacts, samurai armor, and ancient pottery.",
          location: 'Tokyo National Museum, Ueno Park, Tokyo',
          price: '$10',
          latitude: '35.7156',
          longitude: '139.7744',
          duration: '2 hours',
          difficulty: 'Easy',
          category: 'Cultural',
          bestTime: 'Morning',
          bookingRequired: false,
        },
        {
          activityName: 'Visit Asakusa and Senso-ji Temple',
          description:
            'Enjoy the serene beauty of the oldest Buddhist temple in Tokyo, Senso-ji, and explore the vibrant Nakamise Street.',
          location: 'Senso-ji Temple, Asakusa, Tokyo',
          price: '$0',
          latitude: '35.7148',
          longitude: '139.7967',
          duration: '1.5 hours',
          difficulty: 'Easy',
          category: 'Cultural',
          bestTime: 'Afternoon',
          bookingRequired: false,
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          activityName: 'Explore Tsukiji Outer Market',
          description:
            'Savor fresh sushi and seafood in the lively Tsukiji Outer Market, famous for its bustling atmosphere and wide variety of food.',
          location: 'Tsukiji Outer Market, Tokyo',
          price: '$15',
          latitude: '35.6654',
          longitude: '139.7703',
          duration: '2 hours',
          difficulty: 'Easy',
          category: 'Food & Drink',
          bestTime: 'Morning',
          bookingRequired: false,
        },
        {
          activityName: 'Shibuya Crossing and Shopping',
          description:
            'Experience the iconic Shibuya Crossing, the busiest pedestrian crossing in the world, and shop in the trendy boutiques of Shibuya.',
          location: 'Shibuya Crossing, Tokyo',
          price: '$20',
          latitude: '35.6595',
          longitude: '139.7005',
          duration: '3 hours',
          difficulty: 'Moderate',
          category: 'Shopping',
          bestTime: 'Afternoon',
          bookingRequired: false,
        },
      ],
    },
  ],
  paris: [
    {
      day: 1,
      activities: [
        {
          activityName: 'Visit the Eiffel Tower',
          description:
            'Climb or take an elevator ride to the top of this iconic monument for stunning views of Paris.',
          location: 'Eiffel Tower, Paris',
          price: '$25',
          latitude: '48.8584',
          longitude: '2.2945',
          duration: '2 hours',
          difficulty: 'Easy',
          category: 'Cultural',
          bestTime: 'Morning',
          bookingRequired: true,
        },
        {
          activityName: 'Explore the Louvre Museum',
          description:
            "Visit one of the world's largest and most visited museums, home to masterpieces like the Mona Lisa and the Venus de Milo.",
          location: 'Louvre Museum, Paris',
          price: '$15',
          latitude: '48.8606',
          longitude: '2.3376',
          duration: '3 hours',
          difficulty: 'Moderate',
          category: 'Cultural',
          bestTime: 'Afternoon',
          bookingRequired: true,
        },
      ],
    },
  ],
};
