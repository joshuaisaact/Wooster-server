import { updateExistingActivitiesWithSlots } from './slot-number';

const main = async () => {
  try {
    await updateExistingActivitiesWithSlots();
    console.log('Successfully updated activity slots');
    process.exit(0);
  } catch (error) {
    console.error('Error updating slots:', error);
    process.exit(1);
  }
};

main();
