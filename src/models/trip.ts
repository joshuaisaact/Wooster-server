import { Trip } from '../types/tripTypes';

const trips: Trip[] = [
  {
    id: '1',
    destination: 'Tokyo',
    num_days: 2,
    date: '5th November',
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
            image: 'https://www.gotokyo.org/en/spot/7/images/7_0528_1.jpg',
          },
          {
            name: 'Tokyo Skytree',
            description:
              'Head to the Tokyo Skytree, the tallest structure in Japan. Take in the breathtaking panoramic views of the city from its observation decks and explore the adjacent Solamachi shopping complex.',
            location: 'Oshiage, Sumida City, Tokyo',
            price: '$15 - $30 depending on observation deck access',
            image:
              'https://www.tokyoskytree.jp/en/floor/images/img_floor_01.jpg',
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
            image: 'https://www.meijijingu.or.jp/en/about/images/about_01.jpg',
          },
          {
            name: 'Takeshita Street',
            description:
              "Explore the trendy and youth-centric Takeshita Street in Harajuku, famous for its unique fashion boutiques, quirky shops, and vibrant atmosphere. Don't forget to try a colorful crepe or cotton candy!",
            location: 'Harajuku, Shibuya City, Tokyo',
            price: 'Varies depending on shopping preferences',
            image: 'https://www.japan-guide.com/g18/3006_01.jpg',
          },
          {
            name: 'Shibuya Crossing',
            description:
              'Experience the world-famous Shibuya Crossing, one of the busiest pedestrian intersections in the world. Afterward, take a stroll through Shibuya Center-Gai for more shopping and dining options.',
            location: 'Shibuya, Tokyo',
            price: 'Free',
            image: 'https://www.japan-guide.com/g18/3007_01.jpg',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    destination: 'Kyoto',
    num_days: 3,
    date: '5th November',
    itinerary: [
      {
        day: 1,
        activities: [
          {
            name: 'Fushimi Inari Shrine',
            description:
              'Visit the iconic Fushimi Inari Shrine, famous for its thousands of red torii gates that create a stunning pathway up the mountain.',
            location: 'Fushimi, Kyoto',
            price: 'Free',
            image: 'https://www.japan-guide.com/g18/3915_01.jpg',
          },
          {
            name: 'Kinkaku-ji (Golden Pavilion)',
            description:
              'Explore the beautiful Kinkaku-ji, also known as the Golden Pavilion, a Zen Buddhist temple covered in gold leaf and surrounded by lush gardens.',
            location: 'Kyoto',
            price: '¥400',
            image: 'https://www.japan-guide.com/g18/3908_01.jpg',
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            name: 'Arashiyama Bamboo Grove',
            description:
              'Stroll through the enchanting Arashiyama Bamboo Grove, a picturesque bamboo forest in the Arashiyama district.',
            location: 'Arashiyama, Kyoto',
            price: 'Free',
            image: 'https://www.japan-guide.com/g18/3912_01.jpg',
          },
          {
            name: 'Nijo Castle',
            description:
              'Visit Nijo Castle, a historic castle with beautiful gardens and historical architecture, once the residence of the Shogun.',
            location: 'Kyoto',
            price: '¥600',
            image: 'https://www.japan-guide.com/g18/3918_01.jpg',
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            name: 'Gion District',
            description:
              'Explore the Gion District, known for its traditional wooden machiya houses and as a geisha district. Enjoy the old-world charm and historic atmosphere.',
            location: 'Gion, Kyoto',
            price: 'Free',
            image: 'https://www.japan-guide.com/g18/3902_01.jpg',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    destination: 'New York City',
    num_days: 3,
    date: '5th November',
    itinerary: [
      {
        day: 1,
        activities: [
          {
            name: 'Central Park',
            description:
              "Start your day with a stroll through Central Park, New York's iconic urban oasis. Visit Bethesda Fountain, rent a rowboat at the Loeb Boathouse, or simply enjoy a picnic on the Great Lawn.",
            location: 'Manhattan, New York City',
            price: 'Free',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Central_Park_-_The_Pond_%2848377220157%29.jpg/1200px-Central_Park_-_The_Pond_%2848377220157%29.jpg',
          },
          {
            name: 'Metropolitan Museum of Art',
            description:
              "Explore one of the world's largest and most comprehensive art museums, featuring over 2 million works spanning 5,000 years of human creativity.",
            location: '1000 5th Ave, New York, NY 10028',
            price:
              '$25 for adults (pay-what-you-wish for New York State residents)',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg/1200px-Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg',
          },
          {
            name: 'Times Square',
            description:
              'End your first day by experiencing the bright lights and energy of Times Square. Take in the bustling atmosphere, street performers, and larger-than-life billboards.',
            location: 'Midtown Manhattan, New York City',
            price: 'Free',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1200px-New_york_times_square-terabass.jpg',
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            name: 'Statue of Liberty and Ellis Island',
            description:
              'Take a ferry to visit the iconic Statue of Liberty and explore the rich history of immigration at Ellis Island.',
            location: 'New York Harbor',
            price: '$24.30 for adults (includes ferry and audio tours)',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg/800px-Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg',
          },
          {
            name: '9/11 Memorial & Museum',
            description:
              'Pay your respects at the 9/11 Memorial and visit the museum to learn about the events of September 11, 2001, and their impact.',
            location: '180 Greenwich St, New York, NY 10007',
            price: '$26 for adults',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/911_memorial_-_panoramio.jpg/1200px-911_memorial_-_panoramio.jpg',
          },
          {
            name: 'High Line',
            description:
              'Walk along the High Line, a unique elevated park built on a former New York Central Railroad spur, offering a mix of nature, art, and urban views.',
            location: "Manhattan's West Side",
            price: 'Free',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/High_Line_20th_Street_looking_downtown.jpg/1200px-High_Line_20th_Street_looking_downtown.jpg',
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            name: 'Empire State Building',
            description:
              'Start your day with breathtaking views of the city from the observation deck of this iconic skyscraper.',
            location: '20 W 34th St, New York, NY 10001',
            price: '$42 for adults',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg',
          },
          {
            name: 'Broadway Show',
            description:
              'Experience the magic of Broadway by attending a matinee performance of a world-class musical or play.',
            location: 'Theater District, Midtown Manhattan',
            price: 'Varies, typically $75-$200+',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Broadway_and_Times_Square_by_night.jpg/1200px-Broadway_and_Times_Square_by_night.jpg',
          },
          {
            name: 'Brooklyn Bridge',
            description:
              'End your trip with a scenic walk across the Brooklyn Bridge, offering stunning views of the Manhattan skyline and East River.',
            location: 'Brooklyn Bridge, New York, NY 10038',
            price: 'Free',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Brooklyn_Bridge_Pedestrian_Walkway_8_%2879374498%29.jpeg/1200px-Brooklyn_Bridge_Pedestrian_Walkway_8_%2879374498%29.jpeg',
          },
        ],
      },
    ],
  },
];

export default trips;
