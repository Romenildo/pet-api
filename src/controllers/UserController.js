const User = require("../models/User")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const getToken = require("../helpers/get-token")
const createUserToken = require("../helpers/create-user-token")

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

            await createUserToken(newUser, req, res)
        } catch (error) {
            return res.status(500).json({ message: error})
        } 
    }


    static async login (req, res) {

        const { email, password } = req.body

        if(!email || !password){
            return res.status(422).json({ message: "Todos os campos obrigatórios devem ser preeenchidos!"}) 
        }

        //check if user exists
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(422).json({ message: "Email não cadastrado!"})
        }

        //check se password match                (senha recebida com senha do usuario cadastrado no abnco)
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({ message: "Senha inválida!!"})
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {

        let currentUser
        
        if(req.headers.authorization){
            
            const token = getToken(req)

            const decoded = jwt.verify(token, 'secret',)

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        }else{
            currentUser = null
        }
        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {
        const id = req.params.id

        try{
            const user = await User.findById(id).select("-password")
            res.status(200).json({user});

        }catch (error){
            return res.status(422).json({message: 'Usuário não encontrado!'})

        }
    }

    static async editUser(req, res) {
        const id = req.params.id

        try{
            const user = await User.findById(id).select("-password")
            res.status(200).json({user});

        }catch (error){
            return res.status(422).json({message: 'Usuário não encontrado!'})

        }
    }
}