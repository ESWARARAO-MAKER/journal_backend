import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './src/config/dbConfig.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import userRoutes from './src/routes/userRoutes.js'
import submitMenuScript from './src/routes/menuScript.js'

dotenv.config();

const app = express();

//for http protection
app.use(helmet());


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors());

app.use("/api", userRoutes);
app.use("/public", submitMenuScript)

const port = process.env.PORT || 3001;

connectDB();

mongoose.connection.on("connected", () => {
    console.log("DB Connected Successfully");
    app.listen(port, () => {
        console.log(`Server is running on ${port} port`);
    })
});

