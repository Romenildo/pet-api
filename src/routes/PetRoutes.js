const router = require("express").Router()

const PetController = require("../controllers/PetController")

//middleware
const verifyToken = require("../helpers/verify-token")
const { imageUpload } = require("../helpers/image-upload")

router.post('/create',verifyToken,imageUpload.array("images"), PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets',verifyToken, PetController.getAllUserPets)



module.exports = router