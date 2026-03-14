import express from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";

import authRoutes from "./routes/auth.routes.js";

// Force Google DNS to bypass local network DNS SRV blocking
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let collection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("shescript");
        collection = db.collection("searches");
        console.log("MongoDB Connected (native driver)");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        console.log("Server running without DB. Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}

async function connectMongoose() {
    try {
        await mongoose.connect(uri, { dbName: "shescript" });
        console.log("Mongoose Connected");
    } catch (err) {
        console.error("Mongoose connection failed:", err.message);
        setTimeout(connectMongoose, 5000);
    }
}

/* ── Auth Routes ── */

app.use("/api/auth", authRoutes);

/* POST /save */

app.post("/save", async (req, res) => {
    if (!collection) {
        return res.status(503).json({ error: "Database not connected yet" });
    }
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
    if (!collection) {
        return res.json([]);
    }
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
    connectDB();
    connectMongoose();
});
