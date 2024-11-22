export const normalizeDestinationName = (name: string): string => {
  return (
    name
      .trim()
      .toLowerCase()
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Remove special characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace spaces with hyphens
      .replace(/\s/g, '-')
  );
};
