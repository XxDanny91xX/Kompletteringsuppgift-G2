// import file system module
// - used to read file names from the words folder


import express from 'express';


// import the musicMetadata
// npm module - used to read metadata from music files

// Import the database driver
import mysql from 'mysql2/promise';
const app = express();
app.use(express.static('client'));


// Start the server on a certain port
// and write to the terminal which port...
app.listen(3000, () =>
  console.log('Listening on http://localhost:3000'));


const db = await mysql.createConnection({
  host: '161.97.144.27', // 127.0.0.1 if you want to run local db
  port: 8092,               // change to your port
  user: 'root',
  password: 'guessagain92',  // change to your password
  database: 'grupp-db'
});

// A small function for a query
async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

// read all file names from the Music fodler
//const words = await fs.readdirSync('words');

// loop through all music files and read metadata
//for (let word of words) {

  // Get the metadata for the file
  //let metadata = await wordsMetadata.parseFile('client/words/' + word);

  // delete (in-memory) some parts of the metadata
  // that we don't want in the database
  // note: we are not deleteing anything in the files
  //delete metadata.native;
  //delete metadata.quality;
  //delete metadata.common.disk;

  // A search route to find music
app.get('/api/words/:searchTerm/:searchType', async (request, response) => {
  // Get the search term from as a parameter from the route/url
  let searchTerm = request.params.searchTerm;
  // Get teh search type a sa parameter from the route/url
  let searchType = request.params.searchType;
  // Make a database query and remember the result
  // using the search term

  let sql = `
   SELECT * 
   FROM words
   WHERE LOWER(metadata -> '$.common.${searchType}') LIKE LOWER (?)
  `;

  // since the sql gets a bit different if you want to search all
  // fix this with a if-clause replacing the sql
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM words
      WHERE LOWER(metadata) LIKE LOWER (?)
    `;
  }
  let result = await query(sql, ['%' + searchTerm + '%']);
  // Send a response to the client
  response.json(result);
  // Log the result of inserting in the database
  console.log(file, result);
});
