const mongoose = require("..//database")

const PetSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0
        },
        weight:{
            type: Number,
            required: true,
        },
        color:{
            type: String,
            required: true,
        },
        images:{
            type: Array,
            required: true,
        },
        available:{
            type: Boolean,
        },
        user: Object,
        adopter : Object,
    }, 
    { timestamps: true }
)

const Pet = mongoose.model("Pet", PetSchema)

module.exports = Pet