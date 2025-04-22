const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// .env variable
dotenv.config();

const app = express();
app.use(bodyParser.json());

// variables
const port = process.env.PORT;

// Database connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("Database connected");

// end points

app.post("/addSchool", (req, res) => {
  // Includes name, address, latitude, and longitude.
  const name = req.body.name;
  const address = req.body.address;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  // validation checking...
  if (
    !name ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const insert = db.execute(
    "insert into schools (name,address,latitude,longitude) values(?,?,?,?)",
    [name, address, latitude, longitude]
  );

  res.json({
    msg: "record inserted",
  });
});

app.get("/listSchools", (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLng = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const sql = "SELECT * FROM schools";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    const schoolsWithDistance = results.map((school) => {
      const distance = getDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    res.json(schoolsWithDistance);
  });
});

// Haversine Formula
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
