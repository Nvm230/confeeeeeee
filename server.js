// Simple server script para Railway
import { execSync } from 'child_process';

const port = process.env.PORT || 3000;

console.log(`Starting server on port ${port}...`);
console.log(`PORT environment variable: ${process.env.PORT || 'not set (using default 3000)'}`);

try {
  execSync(`serve -s dist -l ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
