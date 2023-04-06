const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res)=>{

    //gerando o token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'secret' )


    //retornando token
    res.status(200).json({
        //será o que o front irá receber ao logar
        message: "Você está autenticado",
        token:token
    })
}

module.exports = createUserToken