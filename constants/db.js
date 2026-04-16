import { config } from "dotenv";
import postgres from "postgres";

config(); // loads your .env file

// load env variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

// create connection
export const sql =
  postgres(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`);