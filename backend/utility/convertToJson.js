const fs = require('fs');

// Path to your input text file and output JSON file
const inputFilePath = 'finleytimestamps.txt';
const outputFilePath = 'output.json';

// Function to convert text data to JSON and save it to a file
function convertTextToJson(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Split the file data by new lines
    const lines = data.trim().split('\n');
    
    // Map each line to an object with id and timestamp properties
    const result = lines.map(line => {
      const [id, timestamp] = line.split(',');
      return { id, timestamp: parseInt(timestamp) };
    });

    // Convert the result to JSON format
    const jsonOutput = JSON.stringify(result, null, 2);

    // Write the JSON output to a file
    fs.writeFile(outputFilePath, jsonOutput, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`JSON data successfully written to ${outputFilePath}`);
    });
  });
}

// Call the function
convertTextToJson(inputFilePath, outputFilePath);
