import express from 'express';
import { connection } from './database/database.js';
import cors from 'cors';
import dotenv from "dotenv";

import categoriesRouter from './routes/categoriesRouter.js'
import gamesRouter from './routes/gamesRouter.js'
import customersRouter from './routes/customersRouter.js'
import rentalsRouter from './routes/rentalsRouter.js'


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);


app.listen(4000, () => {
  console.log('Server listening on port 4000.');
});

