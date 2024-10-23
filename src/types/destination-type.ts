export interface NewDestination {
  destinationName: string;
  latitude: string;
  longitude: string;
  description: string;
  country?: string;
  popularActivities: string;
  travelTips: string;
  nearbyAttractions: string;
  transportationOptions: string;
}

export interface Destination extends NewDestination {
  destinationId: number;
  createdAt: Date;
}
