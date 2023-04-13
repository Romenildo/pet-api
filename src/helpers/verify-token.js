
const jwt = require("jsonwebtoken")
const getToken = require("./get-token")

//middleware
/*Recebe os parametros das requisicoes caso der tudo certo ele ativa o next e vais eguindo para a proxima função da requisicao */
const verifyToken = (req, res, next)=> {

    //caso nao tenha nada no campo do token
    if(!req.headers.authorization){
        return res.status(401).json({ message: "Acesso Negado!"})
    }

    //retira o bearer do token
    const token = getToken(req)

    //caso tenha dado erro no token invalido
    if(!token){
        return res.status(401).json({ message: "Acesso Negado!"})
    }

    try {
        //confirma que o usuario é o mesmo do token
        const verified = jwt.verify(token, 'secret')
        req.user = verified
        next()
    } catch (err) {
        return res.status(400).json({ message: "Token invalido!"})

    }
    
}

module.exports = verifyToken