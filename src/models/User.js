import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    checkbox: {
        type: Boolean,
        default: false
    }
},{
    timestamps: false,
    versionKey: false
});

usersSchema.methods.encrytPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
};

usersSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default model("User", usersSchema)