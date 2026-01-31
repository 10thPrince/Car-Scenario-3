import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill in the name Field!"]
    },
    email: {
        type: String,
        required: [true, "Please fill in the email Field!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please fill in the password Field!"]
    }
},{
    timestamps: true
})

const User = mongoose.model("User", UserSchema);

export default User