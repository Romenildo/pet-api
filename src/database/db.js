const mongoose = require("mongoose")

async function main() {
    await mongoose.connect("mongodb+srv://admin:12345@bandodb.1xpqvar.mongodb.net/api-mongo?retryWrites=true&w=majority")
    console.log("Conectado ao banco de dados")
}

main().catch((err)=>{
    console.lop("Erro na conexão com o banco de dados")
    console.log(error)
})

module.exports = mongoose