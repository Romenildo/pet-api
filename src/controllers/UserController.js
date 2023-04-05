const User = require("../models/User")
const bcrypt = require("bcrypt")
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

        //criptografar a senha
        const hash = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            phone,
            password: hash
        })

        try {
            const newUser = await  user.save()
            res.status(201).json({
                message: 'Usuario cadastrado!',
                newUser,
            })
        } catch (error) {
            return res.status(500).json({ message: error})
        }

       
    }
}