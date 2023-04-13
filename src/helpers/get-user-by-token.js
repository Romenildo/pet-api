/*Funçao que decodifica o token, ao receber o token, usando o secret é possivel pegar os valores salvos no token que no caso foi o nome e id do usuario */

const jwt = require("jsonwebtoken")
const User = require("../models/User")

const getUserByToken = async (token) =>{

    //caso não tenha o token no header
    if(!token){
        return res.status(401).json({ message: "Acesso Negado!"})
    }

    //decoded é a informaçãoq ue tava no token retorna {name: "nome", id: "iewuewie232"}
    const decoded = jwt.verify(token, 'secret')
    const userId = decoded.id
    //utilizando o id recebido no token encontra no bano de dadso tudo sobre ele
    const user = await User.findOne({ _id: userId})

    return user
}

module.exports = getUserByToken