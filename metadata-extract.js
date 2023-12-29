import fs from 'fs';
import odp from 'office-document-properties';
import mysql from 'mysql2/promise';

let docs = fs.readdirSync('./client/words');

const db = await mysql.createConnection({
  host: '161.97.144.27', // 127.0.0.1 if you want to run local db
  port: 8092,               // change to your port
  user: 'root',
  password: 'guessagain92',  // change to your password
  database: 'grupp-db'
});

async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

function readDocMetadata(filePath) {
  return new Promise((resolve, reject) => {
    odp.fromFilePath(filePath, (error, data) => resolve(data || error));
  });
}

let counter = 0;
for (let doc of docs) {
  if (doc.slice(-5) == '.docx') 
  {
    let metadata = await readDocMetadata('./client/words/' + doc);
    console.log(metadata)
    let result = await query(`
    INSERT INTO words (fileName, metadata)
    VALUES(?, ?)
  `, [doc, metadata]);

  console.log(result);
  
  }
}
process.exit();