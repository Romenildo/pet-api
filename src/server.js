const express = require("express")
const cors = require("cors")

const app = express()

//config json response
app.use(express.json())

//CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//iamges
app.use(express.static('public'))


app.listen(5000)