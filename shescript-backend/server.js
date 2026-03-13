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

app.post("/save", async (req, res) => {
    try {
        const { medicine, result, language } = req.body;

        await collection.insertOne({
            medicine,
            result,
            language,
            date: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* GET /history */

app.get("/history", async (req, res) => {
    try {
        const data = await collection
            .find()
            .sort({ date: -1 })
            .limit(5)
            .toArray();

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
