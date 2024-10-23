import { eq } from 'drizzle-orm';
import { promptTemplate } from '../config/trip-prompt-template';
import { db, trips } from '../db';
import { activities } from '../db/tables/activities';
import { destinations } from '../db/tables/destinations';
import { itineraryDays } from '../db/tables/itinerary_days';
import supabase from '../models/supabase-client';

export const fetchTripsFromDB = async () => {
  try {
    const tripData = await db
      .select({
        tripId: trips.tripId,
        destinationId: trips.destinationId,
        startDate: trips.startDate,
        numDays: trips.numDays,
        itineraryDays: itineraryDays.dayNumber,
        activities: {
          activityId: activities.activityId,
          activityName: activities.activityName,
          latitude: activities.latitude,
          longitude: activities.longitude,
          price: activities.price,
          location: activities.location,
          description: activities.description,
        },
        destination: {
          destinationId: destinations.destinationId,
          destinationName: destinations.destinationName,
          latitude: destinations.latitude,
          longitude: destinations.longitude,
          description: destinations.description,
          country: destinations.country,
        },
      })
      .from(trips)
      .leftJoin(
        destinations,
        eq(destinations.destinationId, trips.destinationId),
      )
      .leftJoin(itineraryDays, eq(itineraryDays.tripId, trips.tripId))
      .leftJoin(activities, eq(activities.activityId, itineraryDays.dayNumber));
    return tripData;
  } catch (error) {
    throw new Error(
      `Error fetching trips: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const addTrip = async (
  userId: string,
  destinationId: number,
  startDate: string,
  numDays: number,
) => {
  try {
    const startDateAsDate = new Date(startDate);

    const [insertedTrip] = await db
      .insert(trips)
      .values({
        userId,
        destinationId,
        startDate: startDateAsDate,
        numDays,
      })
      .returning({ tripId: trips.tripId });

    return insertedTrip.tripId;
  } catch (error) {
    throw new Error(
      `Failed to insert trip: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const insertTrip = async (
  destinationId: number,
  startDate: string,
  numDays: number,
) => {
  const { data, error } = await supabase
    .from('trips')
    .insert([
      {
        destination_id: destinationId,
        start_date: startDate,
        num_days: numDays,
      },
    ])
    .select('trip_id')
    .single();

  if (error) {
    throw new Error(`Failed to insert trip: ${error.message}`);
  }

  return data.trip_id;
};

export const deleteItineraryDaysByTripId = async (tripId: string) => {
  const { error: itineraryError } = await supabase
    .from('itinerary_days')
    .delete()
    .match({ trip_id: tripId });

  if (itineraryError) {
    throw new Error(
      `Error deleting itinerary days for trip ${tripId}: ${itineraryError.message}`,
    );
  }
};

export const deleteTripById = async (tripId: string) => {
  const { data, error: tripError } = await supabase
    .from('trips')
    .delete()
    .match({ trip_id: tripId })
    .select();

  if (tripError) {
    throw new Error(
      `Error deleting trip with ID ${tripId}: ${tripError.message}`,
    );
  }

  return data;
};

export const validateTripInput = (
  days: number,
  location: string,
  start_date: string,
): boolean => {
  return days > 0 && !!location && !!start_date;
};

export const createPrompt = (
  days: number,
  location: string,
  startDate: string,
): string => {
  return promptTemplate
    .replace(/{days}/g, days.toString())
    .replace(/{location}/g, location)
    .replace(/{start_date}/g, startDate);
};
