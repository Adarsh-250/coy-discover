import { createDb } from './db.js';
import { seedDatabase } from './seed.js';
import { createApp } from './app.js';

const db = createDb('./coy.db');
seedDatabase(db);

const app = createApp(db);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Coy Discover API listening on http://localhost:${PORT}`);
});
