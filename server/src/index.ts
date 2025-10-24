import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import complaintsRouter from './routes/complaints';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/complaints', complaintsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});