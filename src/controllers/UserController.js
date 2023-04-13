const User = require("../models/User")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const getToken = require("../helpers/get-token")
const createUserToken = require("../helpers/create-user-token")
const getUserByToken = require("../helpers/get-user-by-token")

module.exports = class UserController {

    /*Registrar um  usuario no sistema */
    static async register(req, res) {

        //destructing todos os campos que precisa para salvar o usuario do body da requisicaoq ue veio em um jSON
        const { name, email, phone, password, confirmPassword } = req.body

        //validations
        /*Validações de campos obrigatorios caso não receba o campo retorna a mensagem para o front com o erro
            essa validação pode ser feita separando os campos e retornar já a mensagem para o campo especifico
            Como nome ´pe obrigatorio, email é obrigatorio,...
        */
        if(!name || !email|| !phone || !password || !confirmPassword){
            return res.status(422).json({ message: "Todos os campos obrigatórios devem ser preeenchidos!"})
            
        }
        //confirmar se as 2 senahs são iguais
        if(password !== confirmPassword){
            return res.status(422).json({ message: "Senhas não coincidem!"})
        }
        
        //verificar se o email já está cadastrado no sistema.(O email deve ser unico)
        const userExists = await User.findOne({email: email})
        if(userExists){
            return res.status(422).json({ message: "Email já Existe!"})
        }

        //criptografar a senha
        /*Ao salvar um usuario com senha é necessario cripotografar a senha e transformar ela em um hash
            A senha 12345 vira : #dsabuio3789bnasdhb#@¨&ASAS@!sa
        */
        const hash = await bcrypt.hash(password, 10)


        /*então cria um novo usuario que vais er salvo no banco, e enviar de volta para o front
            A senha não deve ser retornada nem salva somente o seu hash
        */
        const user = new User({
            name,
            email,
            phone,
            password: hash
        })

        try {
            const newUser = await user.save()
            //retorna o token para o usuario fazer o login no sistema
            await createUserToken(newUser, req, res)
        } catch (error) {
            return res.status(500).json({ message: error})
        } 
    }


    /*Fazer login no sistema */
    static async login (req, res) {

        //recebe os dois parametros no body email e senha
        const { email, password } = req.body

        if(!email || !password){
            return res.status(422).json({ message: "Todos os campos obrigatórios devem ser preeenchidos!"}) 
        }

        //verifica se o email é algum cadastrado
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(422).json({ message: "Email não cadastrado!"})
        }

        //verifica se a senha passada é a mesma do banco   (senha recebida com senha do usuario cadastrado no banco)
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({ message: "Senha inválida!!"})
        }
        //se tiver com email e senha correta retorna o token para ele logar
        await createUserToken(user, req, res)

    }

    /* retorna para o front o usuario que fez o login utilizando o token*/
    static async checkUser(req, res) {

        let currentUser
        
        if(req.headers.authorization){
            
            //remove o bearer do token
            const token = getToken(req)
            //decodifica o token pegando o id do usuarioq ue veio no token
            const decoded = jwt.verify(token, 'secret',)
            //pega o usuario no banco a partir do id recebido no token
            currentUser = await User.findById(decoded.id)
            /*
            a senha não deve ser enviada para o front
            outra forma
            currentUser = await User.findById(decoded.id).select("-password")
             */
            currentUser.password = undefined
            
        }else{
            currentUser = null
        }
        return res.status(200).send(currentUser)

    }

    /*Retorna o usuario pelo seu ID */
    static async getUserById(req, res) {
        //o id do usuario é passado pelo parametro na url /user/:id
        // a rota não é protegida por isso nao precisa do token
        const id = req.params.id

        try{
            const user = await User.findById(id).select("-password")
            return res.status(200).json({user});

        }catch (error){
            return res.status(422).json({message: 'Usuário não encontrado!'})

        }
    }

    /*Editar as informacoes do usuario é similar com de add */
    static async editUser(req, res) {
        //pega as novas ionformacoes para serem editadas do usuario
        const { name, email, phone, password, confirmPassword} = req.body

        //Pega as informações atuais de quem ta editado a partir do seu token
        //então estamos editando o usuario que enviou o token com as novas informações do body
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        //caso tenha recebido uma imagem
        if(req.file){
            user.image = req.file.filename
        }
       
         //validations
        if(!name || !email|| !phone){
            return res.status(422).json({ message: "Todos os campos obrigatórios devem ser preeenchidos!"})
        }
        if(password !== confirmPassword){
            return res.status(422).json({ message: "Senhas não coincidem!"})

        }else if( password !== confirmPassword && password != null){
            //caso ele nao queria atualizar a senha
            const hash = await bcrypt.hash(password, 10)
            user.password = hash
        }

        //verifica se o nome email que ele quer já está cadastrado
        const userExists = await User.findOne({email: email})
        if(user.email !== email && userExists){
            return res.status(422).json({ message: "Email já Existe!"})
        }
        
        //adiciona as novas informações para atualizar o suaurio
        user.email = email
        user.name = name
        user.phone = phone

        try {
            
            const updatedUser = await User.findOneAndUpdate(
                { _id:user._id },
                { $set: user },
                { new: true }
            )

            return res.status(200).json({message: "Usuario atualizado", user: updatedUser})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    }
}