import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    sessionToken: String,
    userId: { type: String, required: true },
    expires: Date,
})

const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
export default Session