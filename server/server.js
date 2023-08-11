import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import clear from 'clear';
import { config } from 'dotenv';

import router from './routes.js';

clear();
config();

const app = express();
const PORT = process.env.PORT || 9000;
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = { origin: corsOrigin, credentials: true, optionSucessStatus: 200 }

app.listen(PORT, () => {console.log(`server started running on port ${PORT}`)});
app.use(express.json());
app.use(cors(corsOptions));
app.use('/', router);

const dbHost = process.env.DB_HOST;
mongoose.connect(dbHost);
mongoose.connection.on("error", console.error.bind(console, "could not establish connection with mongodb"))
mongoose.connection.once("open", () => {console.log("connected to mongodb\n")});

// exec run-rs to enable transactions if using localhost