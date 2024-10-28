import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
import path from "path";
// import dbConn from "../db-connections.json" assert {type: "json"};

const PORT = process.env.PORT;

console.log("dbConn", process.env);

import { fileURLToPath } from "url";
import { dirname } from "path";
import { dailyPottyCount, insertData, readData, readLastData } from "./finDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("__DIR",__dirname);
console.log("FULL DIR",path.resolve(__dirname,'frontend/feeding-timer-js'));

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);


// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();

//     const timestamps = await client.db("finley-project").collection("feeding-timestamps").find();



//     for await (const time of timestamps) {
//       console.log(time.id, time.timestamp);
//     }

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


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

app.get("/", async (req, res) => {
  // get all feeding timestamps
  const { time } = await readLastData(false, client);
  if (time) {
    res.status(200).json({ time });
  } else {
    res.status(404).json({ time: null });
  }
});

app.get("/data", async (req, res) => {
  // get all feeding timestamps
  const timestamps = await readData(false, client);
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
  const newTimeStamp = await insertData(req.body.time, 'finleypooptimestamps.txt');
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
  const newTimeStamp = await insertData(req.body.time, 'cloud', client);
  res.status(201).json(newTimeStamp);
});

// host html and js files
app.use('/feeding-timer', express.static(path.resolve(__dirname,'frontend/feeding-timer-js')));
// app.use('feeding-timer', express.static(path.resolve(__dirname, '../frontend/feeding-timer-js')));

// set up the route for the frontend timer page
app.get("/feeding-timer", (req, res) => {
  // console.log(__dirname);
  // const htmlFilePath = path.resolve("../frontend/feeding-timer-js/index.html");
  res.sendFile(path.resolve(__dirname,'frontend/feeding-timer-js/index.html'));
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
