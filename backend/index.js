import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = 7300;

import { fileURLToPath } from "url";
import { dirname } from "path";
import { dailyPottyCount, insertData, readData, readLastData } from "./finDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// /**
//  * Connects to the MongoDB database.
//  * @returns {Promise<void>} A promise that resolves when the connection is successful.
//  */
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(
//       "mongodb://127.0.0.1:27017/FinleyData?directConnection=true"
//     );
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // FeedingTimestamps Schema

// const FeedingTimestampSchema = new mongoose.Schema({
//   time: String,
// });

// const FeedingTimestamps = mongoose.model(
//   "FeedingTimestamp",
//   FeedingTimestampSchema
// );

// // Connect to the database
// const dbConn = await connectDB();

app.get("/", (req, res) => {
  // get all feeding timestamps
  const { time } = readLastData();
  if (time) {
    res.status(200).json({ time });
  } else {
    res.status(404).json({ time: null });
  }
});

app.get("/data", (req, res) => {
  // get all feeding timestamps
  const timestamps = readData();
  if (timestamps) {
    res.status(200).json({ timestamps });
  } else {
    res.status(404).json({ timestamps });
  }
});

app.get("/poop", (req, res) => {
  // get all feeding timestamps
  const poopCount = dailyPottyCount('finleypooptimestamps.txt');
  res.status(200).json({ poopCount });
});

app.post("/poop", async (req, res) => {
  console.log(req.body);
  const newTimeStamp = insertData(req.body.time, 'finleypooptimestamps.txt');
  res.status(201).json(newTimeStamp);
});

app.get("/pee", (req, res) => {
  // get all feeding timestamps
  const peeCount = dailyPottyCount('finleypeetimestamps.txt');
  res.status(200).json({ peeCount });
});

app.post("/pee", async (req, res) => {
  console.log(req.body);
  const newTimeStamp = insertData(req.body.time, 'finleypeetimestamps.txt');
  res.status(201).json(newTimeStamp);
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const newTimeStamp = insertData(req.body.time);
  res.status(201).json(newTimeStamp);
});

// host html and js files
app.use('/feeding-timer', express.static('../frontend/feeding-timer-js'));
// app.use('feeding-timer', express.static(path.resolve(__dirname, '../frontend/feeding-timer-js')));

// set up the route for the frontend timer page
app.get("/feeding-timer", (req, res) => {
  // console.log(__dirname);
  // const htmlFilePath = path.resolve("../frontend/feeding-timer-js/index.html");
  res.sendFile('index.html');
});

// host html and js files for potty-counter
app.use('/potty-counter', express.static('../frontend/potty-counter-js'));

// set up the route for the frontend counter page
app.get("/potty-counter", (req, res) => {
  // console.log(__dirname);
  // res.sendFile(path.resolve("../frontend/potty-counter-js/index.html"));
  res.sendFile('index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
