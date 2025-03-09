const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://connectDbUser:CMudZGSrCAKg9hhq@cluster0.zir54.mongodb.net/map_data?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Define schema and model for the "places" collection
const placeSchema = new mongoose.Schema({}, { strict: false }); // Allows any data structure
const Place = mongoose.model("Place", placeSchema, "places"); // Explicitly specify collection name

// API endpoint to fetch all places
app.get("/api/places/:name", async (req, res) => {
    try {
      const placeName = req.params.name;
      const place = await Place.findOne({ name: placeName });
  
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
  
      res.json(place);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));