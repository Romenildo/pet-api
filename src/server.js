/* O Arquivo de server é a aprte inicial da API onde ela se inicia e possui suas rotas e todas as configurações necessarias para a API funcionar */

const express = require("express")
const cors = require("cors")


//rotas das requisições do sistema
/*Aimportação rotas da aplicação como get, add, remove sao importadas de outro arquivo*/
const UserRoutes = require("./routes/UserRoutes")
const PetRoutes = require("./routes/PetRoutes")

const app = express()

//config json response
/* COnfigura que as requisições permitam receber arquivos JSON como meio de comunicação no body */
app.use(express.json())

//CORS
/* Cors permite a comunicação das requisicoes entre a url da api :5000 e o front :3000
    Então caso o front nao esteja na porta permitida pelo cors que é o 3000 as requisições vao da erro
*/
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//images
app.use(express.static('public'))

//Routes
/*Rota inicial que vai direcionar para qual tipo de requisicao
    na requisicao as rotas sao diferenciadas por http:localhost:5000/pets ou /users
    em seguida para o arquivo das rotas de cada um que se dispersa entre get, post,patch,delete...
*/
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)


//Porta que o servidor irá iniciar http://localhost:5000
app.listen(5000)