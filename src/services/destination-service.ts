import supabase from '../models/supabase-client';

// Fetch all destinations
export const getDestinationsFromDb = async () => {
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('*');

  if (error) {
    throw new Error(`Error fetching destinations: ${error.message}`);
  }

  return destinations;
};

// Fetch a single destination by name
export const getDestinationDetailsByName = async (destinationName: string) => {
  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('destination_name', destinationName)
    .single();

  if (error) {
    throw new Error(
      `Error fetching destination with name ${destinationName}: ${error.message}`,
    );
  }

  return destination;
};

// Fetch a destination ID by name (this is already implemented in your service)
export const getDestinationIdByName = async (location: string) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('destination_id')
    .eq('destination_name', location)
    .single();

  if (error) {
    throw new Error(
      `Error fetching destination with name ${location}: ${error.message}`,
    );
  }

  return data?.destination_id;
};

// Insert a new destination
export const insertDestination = async (destinationData: object) => {
  const { data, error } = await supabase
    .from('destinations')
    .insert([destinationData])
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to insert destination: ${error.message}`);
  }

  return data;
};

// Delete a destination by ID
export const deleteDestinationById = async (destinationId: string) => {
  const { data, error } = await supabase
    .from('destinations')
    .delete()
    .match({ destination_id: destinationId })
    .select();

  if (error) {
    throw new Error(
      `Error deleting destination with ID ${destinationId}: ${error.message}`,
    );
  }

  return data;
};
