import { eq } from 'drizzle-orm';
import { promptTemplate } from '../config/trip-prompt-template';
import { db, trips } from '../db';
import { activities } from '../db/tables/activities';
import { destinations } from '../db/tables/destinations';
import { itineraryDays } from '../db/tables/itinerary_days';
import supabase from '../models/supabase-client';
import { DayItinerary } from '../types/trip-types';

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

export const getTripsFromDb = async () => {
  const { data: trips, error } = await supabase.from('trips').select(`
    trip_id,
    destination_id,
    start_date,
    num_days,
    itinerary_days!inner (
      day_number,
      activities (
        activity_id,
        activity_name,
        latitude,
        longitude,
        price,
        location,
        description
      )
    ),
    destinations!inner (
      destination_id,
      destination_name,
      latitude,
      longitude,
      description,
      country
    )
  `);

  if (error) {
    throw new Error(`Error fetching trips: ${error.message}`);
  }

  return trips;
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

export const insertActivities = async (
  itinerary: DayItinerary[],
  destinationId: number,
) => {
  return Promise.all(
    itinerary.map(async (day) => {
      const activities = day.activities.map((activity) => ({
        location_id: destinationId,
        activity_name: activity.activity_name,
        latitude: activity.latitude,
        longitude: activity.longitude,
        price: activity.price,
        location: activity.location,
        description: activity.description,
      }));

      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .insert(activities)
        .select('activity_id');

      if (activityError) {
        console.error('Error inserting activities:', activityError);
        throw new Error('Failed to insert activities into database');
      }

      return activityData.map((activity) => activity.activity_id);
    }),
  );
};
