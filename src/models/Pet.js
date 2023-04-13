/*Os Models são as entidades da aplicação, a forma de como models é contruida depende de qual banco de dados a aplicação está usando
    O Padraão utilizado é o mongoose para o banco de dados não relacional MongoDB, ele varia se for SQL,...
    São necessario criar um screma com os atributos da entidades que possui na aplicação, na atual posssui
    O schema de Pet e usuario com suas informações
*/

const mongoose = require("../database/db")

const PetSchema = new mongoose.Schema(
    {
        name:{
            //No schema pode definir algumas restricoes e tipos de dados do atributo
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
        //pet possui a informação do usuario de seu dono e adotador
        user: Object,
        adopter : Object,
    }, 
    //timestamps cria automaticamente os campos createAt e updatedAt
    { timestamps: true }
)

const Pet = mongoose.model("Pet", PetSchema)

module.exports = Pet