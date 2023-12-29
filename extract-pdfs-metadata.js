// import fs so we can read which files are in a folder
import fs from 'fs';

// import pdf-parse-fork so we can read metadata from pdf files
import pdfParse from 'pdf-parse-fork';

// Import the database driver
import mysql from 'mysql2/promise';

// read all file names from the folder 'pdfs'
const files = await fs.readdirSync('client\\pdfs');

// Kopplar oss till databasen
const db = await mysql.createConnection({
    // CHANGE TO 127.0.0.1 IF YOU WANT TO RUN LOCAL DB
    host: '161.97.144.27',
    port: "8092",
    user: 'root',
    password: 'guessagain92',
    database: 'grupp-db'
  });


// A small function for a query
async function queryabc(sql, listOfValues) {
    let result = await db.execute(sql, listOfValues);
    return result[0];
  }

  
// loop through all pdfs file and read metadata
for (let file of files) {

  // extract all data/metadata from the pdf
  let data = await pdfParse(fs.readFileSync('./client/pdfs/' + file));

  // create a new object which only contains the parts I'm interested in.
  // there are other parts we don't use:
  // numrender, metadata, version,
  let metadata = {
    numpages: data.numpages,
    info: data.info
  };

  // get the full text of the pdf as well
  let fullText = data.text;
  // todo: write to a column of type json
  console.log(metadata);

  // todo: write to a column of type LONGTEXT
  console.log(fullText);
  // INSERT TO DATABASE
  let result = await queryabc(`INSERT INTO pdfs (fileName, metadata) VALUES(?, ?)`, [file, metadata]);

  // todo - thing we might want to do with the data
  // when we write it to a table in the database

  // todo: write to a column of type varchar
  console.log(file);

}

