import mongoose from "mongoose";

const RevokedTokenSchema = new mongoose.Schema({
    token: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24,
    },
})

const RevokedToken = mongoose.model('RevokedToken', RevokedTokenSchema);

export default RevokedToken