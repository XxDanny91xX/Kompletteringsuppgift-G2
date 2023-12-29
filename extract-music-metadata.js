// Importera filsystem
import fs from 'fs';
// Importera music-metadata för att extrahera metadatan
import musicMetadata from 'music-metadata';
// Importera databasens modul
import mysql from 'mysql2/promise';

// Query funktion
async function query(sql, listOfValues) {
    let result = await db.execute(sql, listOfValues);
    return result[0];
  }
  
  // Läs alla filers namn för musiken
  const files = await fs.readdirSync('music');

  // Kopplar till vår databas
  const db = await mysql.createConnection({
    // CHANGE TO 127.0.0.1 IF YOU WANT TO RUN LOCAL DB
    host: '161.97.144.27',
    port: "8092",
    user: 'root',
    password: 'guessagain92',
    database: 'grupp-db'
  });
  
  // Loopa genom alla musikfiler och läs metadatan
  for (let file of files) {
  
    // Plocka ut metadatan från filen
    let metadata = await musicMetadata.parseFile('./music/' + file);
  
    // Ta bort delar av metadatan som vi inte vill mata in (till databsen)
    // Den här datan försvinner inte från filerna utan den plockas bara inte ut.
    delete metadata.native;
    delete metadata.quality;
    delete metadata.common.disk;
  
    // Sätt in i databasen med hjälp av query funktionen
    let result = await query(`
      INSERT INTO music (fileName, metadata)
      VALUES(?, ?)
    `, [file, metadata]);
  
    // Visar information av det som extraheras och laddas upp till databasen i terminalen.
    console.log(file, result);
  
  }
  
  // Automatisk stop när den loopat genom allt
  // istället för att trycka Ctrl + C
  process.exit();