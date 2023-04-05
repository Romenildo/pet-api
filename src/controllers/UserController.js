const User = require("../models/User")

module.exports = class UserController {

    static async register(req, res) {

        const { name, email, phone, password, confirmPassword } = req.body

        //validations
        if(!name || !email|| !phone || !password || !confirmPassword){
            return res.status(422).json({ message: "Todos os campos obrigatórios devem ser preeenchidos!"})
            
        }
        if(password !== confirmPassword){
            return res.status(422).json({ message: "Senhas não coincidem!"})
        }
        
        //check if user exists
        const userExists = await User.findOne({email: email})
        if(userExists){
            return res.status(422).json({ message: "Email já Existe!"})
        }

        
        return res.json({
            error: false,
            message: "Cadastred com sucesso"
        })
    }
}