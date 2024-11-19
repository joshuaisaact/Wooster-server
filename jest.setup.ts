import supabase from './src/models/supabase-client';

beforeEach(() => {
  console.log('🔄 Resetting mocks');
  jest.clearAllMocks();
});

beforeEach(async () => {
  await supabase.rpc('start_transaction');
});

afterEach(async () => {
  await supabase.rpc('rollback_transaction');
});
