/*Os arquivos de rotas são uma boa prática para não colocar elas noa rquivo de server
    é um intermediario entre a rota inicial no server e os controllers
    Cada rota de entidade deve possuir seu proprio arquivo de rotas
    na aplicação atual está dividida entre Pet e Users
*/

const router = require("express").Router()
const PetController = require("../controllers/PetController")

//middleware
/*Os middleware são funções que ficam entre  a requisicao e o controller para poder acessar as funções do controller
primeiro ele precisa sempre passar pelo middleware*/
const verifyToken = require("../helpers/verify-token")
const { imageUpload } = require("../helpers/image-upload")

/*Função de create possui 2 middleware, primeiro ele verifica se o token  que veio na requisição é valido e existe
    Em seguida possui outro middleware para pegar as imagens que vem na requisicao
    Para finalmente entrar no controller e criar o pet */
router.post('/create',verifyToken,imageUpload.array("images"), PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets',verifyToken, PetController.getAllUserPets)
router.get('/myadoptions',verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id',verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken,imageUpload.array("images"), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router