/*Os Models são as entidades da aplicação, a forma de como models é contruida depende de qual banco de dados a aplicação está usando
    O Padraão utilizado é o mongoose para o banco de dados não relacional MongoDB, ele varia se for SQL,...
    São necessario criar um screma com os atributos da entidades que possui na aplicação, na atual posssui
    O schema de Pet e usuario com suas informações
*/
const mongoose = require("../database/db")

const UserSchema = new mongoose.Schema(
    {
        name:{
            //No schema pode definir algumas restricoes e tipos de dados do atributo
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
    //timestamps cria automaticamente os campos createAt e updatedAt
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema)

module.exports = User