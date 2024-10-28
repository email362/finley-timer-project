import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'finleytimestamps.txt');

// Function to insert data
export function insertData(milliTime = 0, fileName = 'finleytimestamps.txt') {
    const file = path.join(__dirname, fileName);

    let currentTime = milliTime === 0 ? Date.now() : milliTime; // Get current Unix time in milliseconds
    let id = 1;

    // Check if the file exists and is not empty
    if (fs.existsSync(file) && fs.statSync(file).size > 0) {
        // Read the last line to get the last ID
        const lines = fs.readFileSync(file, 'utf-8').split('\n');
        const lastLine = lines[lines.length - 2]; // -2 because the last line is an empty string
        const lastId = parseInt(lastLine.split(',')[0], 10);
        id = lastId + 1;
    }

    const newData = `${id},${currentTime}\n`;

    // Append the new data to the file
    fs.appendFileSync(file, newData, 'utf8');
    console.log(`Data inserted: ID = ${id}, Time = ${currentTime}`);
}

// Function to read the last inserted data
export async function readLastData(local=true, conn=null) {
    if (local) {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        console.log('No data found.');
        return { time: null };
    }

    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const lastLine = lines[lines.length - 2]; // -2 because the last line is an empty string

    if (lastLine) {
        const [id, time] = lastLine.split(',');
        console.log(`Last inserted data: ID = ${id}, Time = ${time}`);
        return {
            time
        };
    } else {
        console.log('No data found.');
        return {
            time: null
        };
    }
    }
    else {
        const database = await conn.db("finley-project");
        const collection = await database.collection("feeding-timestamps");

        const lastDocument = await collection.find().sort({ _id: -1 }).limit(1).toArray();

        return {
            time: lastDocument[0].timestamp
        };
    }
}

// Function to read all timestamp data for visualization
export async  function readData(local=true, conn=null) {
    let timestamps = [];
    if (local) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
        lines.pop();
        timestamps = lines.map(ts => ts.split(',')[1]);
    } else {
        const database = await conn.db("finley-project");
        const collection = await database.collection("feeding-timestamps");

        const cursor = await collection.find();
        console.log("cursor", cursor);

        const arrOfStamps = await cursor.toArray();
        console.log("arr", arrOfStamps);
        timestamps = arrOfStamps.map(ts => ts.timestamp);

    }
    return timestamps;
}

/*

********************* Poop DB Functions *********************

*/

export function dailyPottyCount(fileName) {
    const file = path.join(__dirname, fileName);
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines.pop();
    const timestamps = lines.map(ts => ts.split(',')[1]);
    return timestamps.filter(ts => {
        const date = new Date(Number(ts));
        const dateStr = date.toLocaleDateString().split(',')[0];
        const today = new Date();
        const todayStr = today.toLocaleDateString().split(',')[0];
        return dateStr == todayStr;
    }).length;
} 