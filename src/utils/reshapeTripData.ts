import { DBTrip, Trip } from '../types/tripTypes';

interface Tript {
  trip_id: number;
  destination_id: number;
  start_date: string; // Use Date if you're parsing it later
  num_days: number | null;
  destination_name: string; // Added here
  itinerary_days: ItineraryDay[]; // Define ItineraryDay as needed
}

function reshapeTripData(dbData: DBTrip[]): Tript[] {
  return dbData.map((trip) => ({
    trip_id: trip.trip_id,
    destination_id: trip.destination_id,
    start_date: trip.start_date,
    num_days: trip.num_days,
    destination_name: trip.destinations.destination_name, // Move destination_name up
    itinerary_days: trip.itinerary_days,
  }));
}

export default reshapeTripData;
