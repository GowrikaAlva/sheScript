import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
  medicine: String,
  result: String,
  language: String,
  date: Date
});

export default mongoose.model("Search", SearchSchema);