import fs from 'fs';
import mysql from 'mysql2/promise';

async function insertDataIntoDatabase(data) {
  // Create a MySQL connection pool
  const connection = await mysql.createConnection({
    // CHANGE TO 127.0.0.1 IF YOU WANT TO RUN LOCAL DB
    host: '161.97.144.27',
    port: "8092",
    user: 'root',
    password: 'guessagain92',
    database: 'grupp-db'
  });

    for (let powerpointMetadata of data) {
     
      // extract the file name (the property digest + '.ppt)
      let fileName = powerpointMetadata.digest + '.ppt';
      console.log(fileName)
      // remove the file name
      delete powerpointMetadata.digest;
 
      // remove sha hashes as well (only needed for file authenticity checks)
      delete powerpointMetadata.sha256;
      delete powerpointMetadata.sha512;
 
      // Log things to see that we have the correct filename and metadata
      console.log('');
      console.log(fileName);
      console.log(powerpointMetadata);
 
      // Insert data into the MySQL database
      await connection.query('INSERT INTO powerpoints (fileName, metadata) VALUES (?, ?)',
       [fileName, JSON.stringify(powerpointMetadata)]);
    }
  
}
 
// Read the json string from file
let json = fs.readFileSync('./powerpoint.json', 'utf-8');
 
// Convert from a string to a real data structure

let data = JSON.parse(json);


 insertDataIntoDatabase(data);