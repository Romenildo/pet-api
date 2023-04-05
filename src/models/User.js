const mongoose = require("..//database")

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
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