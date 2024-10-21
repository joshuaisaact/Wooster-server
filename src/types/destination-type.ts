export interface Destination {
  destination_id: number;
  destination_name: string;
  latitude: number;
  longitude: number;
  description: string;
  country?: string;
  created_at: string;
  popular_activities: string[]; // Array of strings
  travel_tips: string[]; // Array of strings
  nearby_attractions: string[]; // Array of strings
  transportation_options: string[]; // Array of strings
}
