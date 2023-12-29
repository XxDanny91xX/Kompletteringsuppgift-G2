// importera exifr för att ta metadata från bilderna
import exifr from 'exifr';
import mysql from 'mysql2/promise';
//Importera file system (fs) - inbyggt i node.js
import fs from 'fs';

// Ger oss en lista på alla filerna i mappen
let images = fs.readdirSync('images');

// Kopplar oss till databasen
const db = await mysql.createConnection({
    // CHANGE TO 127.0.0.1 IF YOU WANT TO RUN LOCAL DB
    host: '161.97.144.27',
    port: "8092",
    user: 'root',
    password: 'guessagain92',
    database: 'grupp-db'
  });

// Funktion för att skapa querys 
async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

// Läs alla filers namn från images mappen
const files = await fs.readdirSync('images');

// Loopa genom alla bilder och läs metadata
for (let image of images) {

  // Ta metadatan från filen
  let metadata = await exifr.parse('images/' + image);

  // Sätt in i databasen med hjälp av query funktionen
  let result = await query(`
    INSERT INTO images (fileName, metadata)
    VALUES(?, ?)
  `, [image, metadata]);

  // Logga resultatet för att se att något händer.
  console.log(image, result);

}

// Automatisk stop när det är klart, annars tror VSC
// att något mer ska skickas in då vi är kopplade till databasen.
process.exit();