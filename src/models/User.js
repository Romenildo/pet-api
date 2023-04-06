const mongoose = require("../database/db")

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        image:{
            type: String
        },
        phone:{
            type: String,
            required: true,
        },
    }, 
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema)

module.exports = User