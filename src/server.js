const express = require("express")
const cors = require("cors")


const UserRoutes = require("./routes/UserRoutes")
const PetRoutes = require("./routes/PetRoutes")

const app = express()

//config json response
app.use(express.json())

//CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//iamges
app.use(express.static('public'))

//Routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)


app.listen(5000)