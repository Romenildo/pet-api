/*Função para receber as imagens do front e salvar em um arquivo no back*/

const multer = require("multer")
const path = require("path")

const imageStorage = multer.diskStorage({
    //local de onde guardar as imagens
    destination : function(req, file, callback){

        let folder = ""

        if(req.baseUrl.includes("users")){
            folder = "users"
        }else if (req.baseUrl.includes("pets")){
            folder = "pets"
        }

        callback(null, `public/imgs/${folder}`)
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + String(Math.floor(Math.random()*1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, callback){
        //se no nome do arquivo nao tiver png ou jpg
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return callback(new Error("Somente arquivos jpg ou png!"))
        }
        callback(undefined, true)
    }
    
})

module.exports = {imageUpload}