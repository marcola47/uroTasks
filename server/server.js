import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes.js';

// ***************************************************************************************
// server settings
const app = express();
const PORT = process.env.PORT || 9000;
const corsOptions = { origin: ['http://localhost:3000', 'https://urotasks.onrender.com'], credentials: true, optionSucessStatus: 200 }

app.listen(PORT, () => {console.log(`server started running on port ${PORT}`)});
app.use(express.json());
app.use(cors(corsOptions));
app.use('/', routes);

// ***************************************************************************************
// mongodb connection
mongoose.connect('mongodb+srv://marcola88:egdb1122@urotasks.wwkpbcj.mongodb.net/');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "could not establish connection with mongdb"))
db.once("open", () => {console.log("connected to mongodb\n")});