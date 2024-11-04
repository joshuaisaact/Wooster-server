export const validateTripInput = (
  days: number,
  location: string,
  start_date: string,
): boolean => {
  return days > 0 && !!location && !!start_date;
};
