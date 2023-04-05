const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://admin:12345@bandodb.1xpqvar.mongodb.net/api-pet?retryWrites=true&w=majority",
 {},
 (error)=>{
    if(error){
        console.lop("Erro na conexão com o banco de dados")
        console.log(error)
        return
    }

    console.log("Conexão com banco de dados foi um sucesso")
 })

 module.exports = mongoose