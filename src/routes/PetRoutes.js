const router = require("express").Router()

const PetController = require("../controllers/PetController")

//middleware
const verifyToken = require("../helpers/verify-token")
const { imageUpload } = require("../helpers/image-upload")

router.post('/create',verifyToken,imageUpload.array("images"), PetController.create)
router.post('/login', PetController.login)
router.get('/checkpet', PetController.checkPet)
router.get('/:id', PetController.getPetById)

//rota protegida
router.patch('/edit', verifyToken,imageUpload.single("image"), PetController.editPet)


module.exports = router