// // src/test/setup.ts
// type ConsoleError = typeof console.error;
// let originalError: ConsoleError;

// beforeAll(() => {
//   // Immediately silence all console methods
//   jest.spyOn(console, 'log').mockImplementation(() => {});
//   jest.spyOn(console, 'info').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
//   jest.spyOn(console, 'error').mockImplementation(() => {});
// });

// afterAll(() => {
//   // Restore console functions after all tests
//   (console.log as jest.Mock).mockRestore();
//   (console.info as jest.Mock).mockRestore();
//   (console.warn as jest.Mock).mockRestore();
//   (console.error as jest.Mock).mockRestore();
// });
