// importe mysql pour se connecter à la base
import mysql, { Pool } from 'mysql2';

// importe la variable d'environnement
let databaseUrl: string = process.env.CLEARDB_DATABASE_URL || '';
// retire le type de base de données
databaseUrl = databaseUrl.substring(8);
// who doesn't love some good old effective Regex ?
const [user, password, host, database] = databaseUrl.split(
  /[:@/?)<>{}\[\]\r\n/\\]+/
);
// créer l'objet pool

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: Number(process.env.DB_PORT), // port of the DB server (mysql), not to be confused with the nodeJS server PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// exporte l'objet pool pour l'utiliser ailleurs
export default pool;
