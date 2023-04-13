
/*Arquivo de conexão com o banco de dados, possui as configuracoes de usuario e senha
    Cada banco de dadso possui sua maneira diferente de configuração está é a do mongoDb utilizando o mongoose
*/
const mongoose = require("mongoose")

async function main() {
    await mongoose.connect("mongodb+srv://admin:12345@bandodb.1xpqvar.mongodb.net/api-mongo?retryWrites=true&w=majority")
    console.log("Conectado ao banco de dados")
}

main().catch((error)=>{
    console.lop("Erro na conexão com o banco de dados")
    console.log(error)
})

module.exports = mongoose