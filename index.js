import fs from "fs";
import http from "http";
import { sql } from "./constants/db.js";

const server = http.createServer(async (req, res) => {
  try {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // HOME
    if (req.url === "/" && req.method === "GET") {
      const html = fs.readFileSync("index.html");
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    // GET USERS
    if (req.url === "/users" && req.method === "GET") {
      const users = await sql`SELECT * FROM users;`;
      res.end(JSON.stringify(users));
      return;
    }

    // CREATE USER
    if (req.url === "/users" && req.method === "POST") {
      let body = "";

      req.on("data", chunk => body += chunk);

      req.on("end", async () => {
        const { name, username, email, dob } = JSON.parse(body);

        await sql`
          INSERT INTO users (name, dob, username, email)
          VALUES (${name}, ${dob}, ${username}, ${email})
        `;

        res.end(JSON.stringify({ message: "User added" }));
      });

      return;
    }

    // DELETE USER
    if (req.url.startsWith("/users/") && req.method === "DELETE") {
      const username = req.url.split("/")[2];

      await sql`DELETE FROM users WHERE username = ${username}`;

      res.end(JSON.stringify({ message: "User deleted" }));
      return;
    }

    // UPDATE USER
    if (req.url === "/users" && req.method === "PUT") {
      let body = "";

      req.on("data", chunk => body += chunk);

      req.on("end", async () => {
        const { username, name, email } = JSON.parse(body);

        await sql`
          UPDATE users
          SET name = ${name}, email = ${email}
          WHERE username = ${username}
        `;

        res.end(JSON.stringify({ message: "User updated" }));
      });

      return;
    }

    // SEARCH USER
    if (req.url.startsWith("/search/") && req.method === "GET") {
      const username = req.url.split("/")[2];

      const users = await sql`
        SELECT * FROM users WHERE username = ${username}
      `;

      res.end(JSON.stringify(users));
      return;
    }

    res.end(JSON.stringify({ message: "Route not found" }));

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.end(JSON.stringify({ error: "Server crashed" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});