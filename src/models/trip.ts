import { Trip } from '../types/tripTypes';

const trip: Trip = {
  destination: 'Tokyo',
  num_days: 2,
  itinerary: [
    {
      day: 1,
      activities: [
        {
          name: 'Sensoji Temple',
          description:
            "Visit the historic Sensoji Temple in Asakusa, one of Tokyo's oldest and most significant temples. Walk through the iconic Kaminarimon gate and explore Nakamise-dori, a shopping street filled with traditional snacks and souvenirs.",
          location: 'Asakusa, Taito City, Tokyo',
          price: 'Free',
        },
        {
          name: 'Tokyo Skytree',
          description:
            'Head to the Tokyo Skytree, the tallest structure in Japan. Take in the breathtaking panoramic views of the city from its observation decks and explore the adjacent Solamachi shopping complex.',
          location: 'Oshiage, Sumida City, Tokyo',
          price: '$15 - $30 depending on observation deck access',
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          name: 'Meiji Shrine',
          description:
            'A tranquil forested shrine dedicated to Emperor Meiji and Empress Shoken. Walk through the giant torii gates and enjoy a peaceful stroll through the surrounding Yoyogi Park.',
          location: 'Shibuya, Tokyo',
          price: 'Free',
        },
        {
          name: 'Takeshita Street',
          description:
            "Explore the trendy and youth-centric Takeshita Street in Harajuku, famous for its unique fashion boutiques, quirky shops, and vibrant atmosphere. Don't forget to try a colorful crepe or cotton candy!",
          location: 'Harajuku, Shibuya City, Tokyo',
          price: 'Varies depending on shopping preferences',
        },
        {
          name: 'Shibuya Crossing',
          description:
            'Experience the world-famous Shibuya Crossing, one of the busiest pedestrian intersections in the world. Afterward, take a stroll through Shibuya Center-Gai for more shopping and dining options.',
          location: 'Shibuya, Tokyo',
          price: 'Free',
        },
      ],
    },
  ],
};

export default trip;
