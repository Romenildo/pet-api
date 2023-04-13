/*Os arquivos de rotas são uma boa prática para não colocar elas noa rquivo de server
    é um intermediario entre a rota inicial no server e os controllers
    Cada rota de entidade deve possuir seu proprio arquivo de rotas
    na aplicação atual está dividida entre Pet e Users
*/

const router = require("express").Router()
const UserController = require("../controllers/UserController")

//middleware
/*Os middleware são funções que ficam entre  a requisicao e o controller para poder acessar as funções do controller
primeiro ele precisa sempre passar pelo middleware*/
const verifyToken = require("../helpers/verify-token")
const { imageUpload } = require("../helpers/image-upload")

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

//rota protegida
/*São rotas que precisam passar pelo middleware de verificar o token, o usuario so pode editar seus dados,
    se ele tiver autenticado com o token dizendoq ue aquelas informações é dele*/
router.patch('/edit', verifyToken,imageUpload.single("image"), UserController.editUser)


module.exports = router