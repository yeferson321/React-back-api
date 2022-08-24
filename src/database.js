import {connect} from "mongoose";
require('dotenv').config();

const { MONGO_URT } = process.env;
const MONGO_BASE = `${MONGO_URT}`;

(async () => {
    try{
        const db = await connect(MONGO_BASE);
        console.log(MONGO_URT)
        console.log("Db connected to", db.connection.name)
    } catch (error){
        console.log(error);
    }
})();
