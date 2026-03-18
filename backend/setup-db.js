const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDB() {
  const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;

  // First connect to postgres default db to create the db
  const clientInitial = new Client({
    host: DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: DB_USER,
    password: DB_PASSWORD || "",
  });

  try {
    await clientInitial.connect();
    console.log("Connected to default postgres DB.");
    // check if db exists
    const res = await clientInitial.query("SELECT datname FROM pg_database WHERE datname='stuplan'");
    if (res.rowCount === 0) {
      console.log("Creating database stuplan...");
      await clientInitial.query(`CREATE DATABASE stuplan`);
    } else {
      console.log("Database stuplan already exists.");
      // Drop it so we start fresh, user wants everything to work perfectly.
      await clientInitial.query(`DROP DATABASE stuplan`);
      await clientInitial.query(`CREATE DATABASE stuplan`);
    }
  } catch(e) {
    if (e.code === '55006') {
      console.log("Cannot drop db, it is in use. We will just use it.");
    } else {
      console.error("Error connecting to create DB:", e.message);
      process.exit(1);
    }
  } finally {
    await clientInitial.end();
  }

  // Next connect to the new db and run table creation
  const client = new Client({
    host: DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: 'stuplan',
    user: DB_USER,
    password: DB_PASSWORD || "",
  });

  try {
    await client.connect();
    console.log("Connected to stuplan DB. Creating tables...");
    
    // Read the sql file
    const sqlFile = path.join(__dirname, '../db.sql');
    let sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Remove the Create DB statements from SQL since we already did it
    sql = sql.replace(/DROP DATABASE IF EXISTS stuplan;/g, '');
    sql = sql.replace(/CREATE DATABASE stuplan;/g, '');
    sql = sql.replace(/\\c stuplan;/g, '');
    
    await client.query(sql);
    console.log("Tables created successfully!");
    
  } catch(e) {
    console.error("Error creating tables:", e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDB();
