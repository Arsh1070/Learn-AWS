const mysql = require("mysql2/promise");

 const pool = mysql.createPool({
  host: "mysql_arsh", // Use the service name defined in docker-compose.yaml
  user: "app-user",
  password: "Arsh@1234",
  database: "testdb",
 // port: 8080, // ⚠️ MySQL default port (not 8080)
});
/* const pool = mysql.createPool({
  host: "localhost", // Use the service name defined in docker-compose.yaml
  user: "app-user",
  password: "Arsh@1234",
  database: "testdb",
  port: 3306, // ⚠️ MySQL default port (not 8080)
}); */
// 🔥 Function to check DB connection
/*  async function checkDBConnection(retries = 2) {

    try {
       const connection = await pool.getConnection();
        await connection.query(`CREATE DATABASE IF NOT EXISTS testdb`);
        await connection.query(`USE testdb`);
        await connection.query(`CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        )`);

       console.log("✅ Database ready");

       connection.release();
    } catch (err) {
      console.error("❌ DB connection failed.", err.message);
    }
}

// 🚀 Run check immediately when file loads
checkDBConnection(); */

module.exports = pool;