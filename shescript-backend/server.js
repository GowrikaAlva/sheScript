import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let collection;

async function connectDB() {
  await client.connect();
  const db = client.db("shescript");
  collection = db.collection("searches");
  console.log("MongoDB Connected");
}

connectDB();

/* POST /save */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
