declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    // Add more as needed, for example:
    // NODE_ENV: 'development' | 'production';
    // DATABASE_URL: string;
  }
}
