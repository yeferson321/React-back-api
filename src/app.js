import express from "express";
import morgan from "morgan";
import cors from "cors";
import init from "./routes/init";
import register from './routes/register';
import registerGoogle from './routes/registerGoogle';
import login from './routes/login';
import forgetPassword from './routes/forgetPassword';
import newPassword from './routes/newPassword';
import datos from './routes/datos';
import './database';
require('dotenv').config();

const app = express()

// middLewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
const options = { origin: process.env.ORIGIN, }
app.use(cors(options))

// routes
app.use(init);
app.use(register);
app.use(registerGoogle);
app.use(login);
app.use(forgetPassword);
app.use(newPassword);
app.use(datos);

export default app