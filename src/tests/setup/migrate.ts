import fs from 'fs';
import path from 'path';

// Path to your generated migration folder
const migrationsDir = path.join(__dirname, '../drizzle/sqlite');
console.log(migrationsDir);
// Function to apply migrations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyMigrations = (db: any) => {
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'));

  migrationFiles.forEach((file) => {
    const migrationSQL = fs.readFileSync(
      path.join(migrationsDir, file),
      'utf-8',
    );
    db.exec(migrationSQL); // Execute the SQL in the in-memory database
  });
};
