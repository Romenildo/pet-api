const Pet = require("../models/Pet")

const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

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
}