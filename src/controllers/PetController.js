const Pet = require("../models/Pet")

const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const ObjectId = require("mongoose").Types.ObjectId

module.exports = class PetController {

    //create
    static async create(req, res){

        const {name, age, weight, color } = req.body
        const available = true;
        const images = req.files


        //validations
        if(!name || !age || !weight || !color || images.length === 0){
            return res.status(422).json({ message: "Todos os campos obrigátorios devem ser preenchidos"})
        }


        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id:user._id,
                name: user.name,
                image: user.iamge,
                phone: user.phone
            }
        })

        images.map((img)=>{
            pet.images.push(img.filename)
        })

        try {
            
            const newPet = await pet.save()
            res.status(201).json({
                message: "Pet cadastrado com sucesso!",
                newPet
            })

        } catch (err) {
            return res.status(500).json({message: err})
        }
    }

    static async getAll(req, res){

        const pets = await Pet.find().sort("-createdAt")
        res.status(200).json({
            pets: pets
        })
    }

    static async getAllUserPets(req, res){

        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort("-createdAt")
        res.status(200).json({
            pets: pets
        })

        res.status(200).json({
            pets
        })
    }

    static async getAllUserAdoptions(req, res){

        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort("-createdAt")
        res.status(200).json({
            pets: pets
        })

        res.status(200).json({
            pets
        })
    }

    static async getPetById(req, res){

        const id = req.params.id

        //check if id is valid
        if(!ObjectId.isValid(id)){
            return res.status(422).json({ message: "Id invalido!"})
        }

        //check if pet exists
        const pet = await Pet.findOne({_id: id})
        if(!pet){
            return res.status(404).json({ message: "Pet não encontrado!"})
        }

        res.status(200).json({
            pet: pet
        })
    }

    static async removePetById(req, res){

        const id = req.params.id

        //check if id is valid
        if(!ObjectId.isValid(id)){
            return res.status(422).json({ message: "Id invalido!"})
        }

        //check if pet exists
        const pet = await Pet.findOne({_id: id})
        if(!pet){
            return res.status(404).json({ message: "Pet não encontrado!"})
        }

        //check if logged in user registered the pet
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            return res.status(422).json({ message: "Pet nao é do usuario logado!"})

        }
        //delete pet
        await Pet.findByIdAndDelete(id)

        res.status(200)
    }


    static async updatePet(req, res){

        const id = req.params.id
        const {name, age, weight, color} = req.body
        const images = req.files
        const updatedData = {}

        //check if pet exists
        const pet = await Pet.findOne({_id: id})
        if(!pet){
            return res.status(404).json({ message: "Pet não encontrado!"})
        }

        //check if logged in user registered the pet
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            return res.status(422).json({ message: "Pet nao é do usuario logado!"})
        }

        //validations
        if(!name || !age || !weight || !color || images.length === 0){
            return res.status(422).json({ message: "Todos os campos obrigátorios devem ser preenchidos"})
        }
        updatedData.name = name
        updatedData.age = age
        updatedData.weight = weight
        updatedData.color = color

        if(images.length === 0){
            return res.status(422).json({ message: "Todos os campos obrigátorios devem ser preenchidos"})
        }else{
            updatedData.images = []
            images.map((img)=>{
                updatedData.images.push(img.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({ message: "pet atualizado com sucesso"})
    }

    static async updatePet(req, res){
        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({_id: id})
        if(!pet){
            return res.status(404).json({ message: "Pet não encontrado!"})
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        //o id do pet que ele selecionou é igual ao dele
        if(pet.user._id.equals(user._id)){
            return res.status(422).json({ message: "Você não pode agendar uma visita com o seu próprio Pet!"})
        }

        //check if user has already scheduled a visit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                return res.status(422).json({ message: "Você já agendou uma visita para este Pet!!"})

            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }
        
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200)
            .json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`})
    }


}