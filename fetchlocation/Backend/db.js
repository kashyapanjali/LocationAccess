const mysql = require("mysql2");

// Create a connection pool to handle multiple requests
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "anjalisql123@#*",
  database: "user_auth",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the connection pool
module.exports = pool.promise();
