import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import carRoutes from "./routes/carRoutes.js"
import serviceRoutes from "./routes/serviceRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import invoiceRoutes from "./routes/invoiceRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import packageRoutes from "./routes/packageRoutes.js"
import cors from 'cors'

dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    method:['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.status(200).json({ Success: true, Message: "Car Manager App Running Successfull!" });
})

app.use('/user', userRoutes);
app.use('/cars', carRoutes);
app.use('/services', serviceRoutes);
app.use('/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/packages', packageRoutes);


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
