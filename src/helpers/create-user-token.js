/* Função para contruir o token do usuario
    utiliza o jsonwebtoken que ao receber os parametros que deseja passar no token, mais o segredo que é uma string onde
    é utilizada na hora de criar o token como na hora de decodificar o token devem ser o mesmo segredo
*/
const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res)=>{

    //gerando o token
    /* Criando o token recebe os parametros que deseja passar nele que ao decodificar vai possui o id e o nome do usuario que criou*/
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'secret' )


    //retornando token
     return res.status(200).json({
        //será o que o front irá receber ao logar
        message: "Você está autenticado",
        token:token
    })
    /*O front recebe o token para já logar no sistema, e setar o token no localStorage do usuario que logou
    O token eh : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9tIiwiaWQiOiI2NDJlYzIwNGQ0ODI1ZWNhMGE4MjE5NmQiLCJpYXQiOjE2ODA3ODg0ODF9.XxoOfKJTEy-Iuwmk3XkRlMGlU5Y2_TKqBUsBAl_U3X0
    o qual ao decodificado vai possuir o nome e id do usuario
    */
}

module.exports = createUserToken