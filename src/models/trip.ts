import { Trip } from '../types/tripTypes';

const trips: Trip[] = [
  {
    trip_id: '1',
    destination_name: 'Tokyo',
    num_days: 2,
    date: '12th December',
    itinerary: [
      {
        day: 1,
        activities: [
          {
            activity_name: 'Sensoji Temple',
            description:
              "Visit the historic Sensoji Temple in Asakusa, one of Tokyo's oldest and most significant temples. Walk through the iconic Kaminarimon gate and explore Nakamise-dori, a shopping street filled with traditional snacks and souvenirs.",
            location: 'Asakusa, Taito City, Tokyo',
            price: 'Free',
            latitude: 35.7148,
            longitude: 139.7967,
          },
          {
            activity_name: 'Tokyo Skytree',
            description:
              'Head to the Tokyo Skytree, the tallest structure in Japan. Take in the breathtaking panoramic views of the city from its observation decks and explore the adjacent Solamachi shopping complex.',
            location: 'Oshiage, Sumida City, Tokyo',
            price: '$15 - $30 depending on observation deck access',
            latitude: 35.7106,
            longitude: 139.8212,
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            activity_name: 'Meiji Shrine',
            description:
              'A tranquil forested shrine dedicated to Emperor Meiji and Empress Shoken. Walk through the giant torii gates and enjoy a peaceful stroll through the surrounding Yoyogi Park.',
            location: 'Shibuya, Tokyo',
            price: 'Free',
            latitude: 35.6764,
            longitude: 139.6993,
          },
          {
            activity_name: 'Takeshita Street',
            description:
              "Explore the trendy and youth-centric Takeshita Street in Harajuku, famous for its unique fashion boutiques, quirky shops, and vibrant atmosphere. Don't forget to try a colorful crepe or cotton candy!",
            location: 'Harajuku, Shibuya City, Tokyo',
            price: 'Varies depending on shopping preferences',
            latitude: 35.6705,
            longitude: 139.702,
          },
          {
            activity_name: 'Shibuya Crossing',
            description:
              'Experience the world-famous Shibuya Crossing, one of the busiest pedestrian intersections in the world. Afterward, take a stroll through Shibuya Center-Gai for more shopping and dining options.',
            location: 'Shibuya, Tokyo',
            price: 'Free',
            latitude: 35.6595,
            longitude: 139.7004,
          },
        ],
      },
    ],
  },
  {
    trip_id: '2',
    destination_name: 'Kyoto',
    num_days: 3,
    date: '5th November',
    itinerary: [
      {
        day: 1,
        activities: [
          {
            activity_name: 'Fushimi Inari Shrine',
            description:
              'Visit the iconic Fushimi Inari Shrine, famous for its thousands of red torii gates that create a stunning pathway up the mountain.',
            location: 'Fushimi, Kyoto',
            price: 'Free',
            latitude: 34.9668,
            longitude: 135.7726,
          },
          {
            activity_name: 'Kinkaku-ji (Golden Pavilion)',
            description:
              'Explore the beautiful Kinkaku-ji, also known as the Golden Pavilion, a Zen Buddhist temple covered in gold leaf and surrounded by lush gardens.',
            location: 'Kyoto',
            price: '¥400',
            latitude: 35.0394,
            longitude: 135.7292,
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            activity_name: 'Arashiyama Bamboo Grove',
            description:
              'Stroll through the enchanting Arashiyama Bamboo Grove, a picturesque bamboo forest in the Arashiyama district.',
            location: 'Arashiyama, Kyoto',
            price: 'Free',
            latitude: 35.0139,
            longitude: 135.6696,
          },
          {
            activity_name: 'Nijo Castle',
            description:
              'Visit Nijo Castle, a historic castle with beautiful gardens and historical architecture, once the residence of the Shogun.',
            location: 'Kyoto',
            price: '¥600',
            latitude: 35.0115,
            longitude: 135.74,
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            activity_name: 'Gion District',
            description:
              'Explore the Gion District, known for its traditional wooden machiya houses and as a geisha district. Enjoy the old-world charm and historic atmosphere.',
            location: 'Gion, Kyoto',
            price: 'Free',
            latitude: 35.0038,
            longitude: 135.7787,
          },
        ],
      },
    ],
  },
  {
    trip_id: '3',
    destination_name: 'New York City',
    num_days: 3,
    date: '5th November',
    itinerary: [
      {
        day: 1,
        activities: [
          {
            activity_name: 'Central Park',
            description:
              "Start your day with a stroll through Central Park, New York's iconic urban oasis. Visit Bethesda Fountain, rent a rowboat at the Loeb Boathouse, or simply enjoy a picnic on the Great Lawn.",
            location: 'Manhattan, New York City',
            price: 'Free',
            latitude: 40.7851,
            longitude: -73.9683,
          },
          {
            activity_name: 'Metropolitan Museum of Art',
            description:
              "Explore one of the world's largest and most comprehensive art museums, featuring over 2 million works spanning 5,000 years of human creativity.",
            location: '1000 5th Ave, New York, NY 10028',
            price:
              '$25 for adults (pay-what-you-wish for New York State residents)',
            latitude: 40.7794,
            longitude: -73.9632,
          },
          {
            activity_name: 'Times Square',
            description:
              'End your first day by experiencing the bright lights and energy of Times Square. Take in the bustling atmosphere, street performers, and larger-than-life billboards.',
            location: 'Midtown Manhattan, New York City',
            price: 'Free',
            latitude: 40.758,
            longitude: -73.9855,
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            activity_name: 'Statue of Liberty and Ellis Island',
            description:
              'Take a ferry to visit the iconic Statue of Liberty and explore the rich history of immigration at Ellis Island.',
            location: 'New York Harbor',
            price: '$24.30 for adults (includes ferry and audio tours)',
            latitude: 40.6892,
            longitude: -74.0445,
          },
          {
            activity_name: '9/11 Memorial & Museum',
            description:
              'Pay your respects at the 9/11 Memorial and visit the museum to learn about the events of September 11, 2001, and their impact.',
            location: '180 Greenwich St, New York, NY 10007',
            price: '$26 for adults',
            latitude: 40.7115,
            longitude: -74.0134,
          },
          {
            activity_name: 'High Line',
            description:
              'Walk along the High Line, a unique elevated park built on a former New York Central Railroad spur, offering a mix of nature, art, and urban views.',
            location: "Manhattan's West Side",
            price: 'Free',
            latitude: 40.746,
            longitude: -74.0048,
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            activity_name: 'Empire State Building',
            description:
              'Start your day with breathtaking views of the city from the observation deck of this iconic skyscraper.',
            location: '20 W 34th St, New York, NY 10001',
            price: '$42 for adults',
            latitude: 40.748817,
            longitude: -73.985428,
          },
          {
            activity_name: 'Broadway Show',
            description:
              'Experience the magic of Broadway by attending a matinee performance of a world-class musical or play.',
            location: 'Theater District, Midtown Manhattan',
            price: 'Varies, typically $75-$200+',
            latitude: 40.759,
            longitude: -73.9845,
          },
          {
            activity_name: 'Brooklyn Bridge',
            description:
              'End your trip with a scenic walk across the Brooklyn Bridge, offering stunning views of the Manhattan skyline and East River.',
            location: 'Brooklyn Bridge, New York, NY 10038',
            price: 'Free',
            latitude: 40.7061,
            longitude: -73.9969,
          },
        ],
      },
    ],
  },
];

export default trips;
