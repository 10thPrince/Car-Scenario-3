import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({ Success: true, Message: "Car Manager App Running Successfull!" });
})


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`Database Connected Successfull`);
        app.listen(port, () => {
            console.log(`App running on port : ${port}`);
        })
    })
    .catch((err) => {
        console.log(`An Error Occured ${err}`);
        process.exit(1);
    })
