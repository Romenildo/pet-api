const Pet = require("../models/Pet");

const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {

  /*Cria um novo pet do usuario */
  static async create(req, res) {

    //recebe as infomraçõs do body
    const { name, age, weight, color } = req.body;
    const available = true;
    //os arquivos de imagens vemd e outro local na requisicao dos .files que é diferente do body
    const images = req.files;

    //validations
    if (!name || !age || !weight || !color || images.length === 0) {
      return res
        .status(422)
        .json({
          message: "Todos os campos obrigátorios devem ser preenchidos",
        });
    }

    //pega o dono do pet que enviou a requisicao, como vem seu id no token é possivel pegar ele
    const token = getToken(req);
    const user = await getUserByToken(token);

    //Então cria o novo pet com as suas informações e o usuario que o cadastrou
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.iamge,
        phone: user.phone,
      },
    });

    //como pode ser varias imagens é preciso percorrer e adicionalar ao novo pet
    images.map((img) => {
      pet.images.push(img.filename);
    });

    try {
      //e finalmente salvando o pet e retornando para o front
      const newPet = await pet.save();
      return res.status(201).json({
        message: "Pet cadastrado com sucesso!",
        newPet,
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  /*Retorna todos os pets cadastrados no sistema ordenados pelos urdimos adicionados */
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");
    return res.status(200).json({
      pets: pets,
    });
  }

  /* pega todos os pets do usuario que mandou pedir atraves do seu token na requisicao*/
  static async getAllUserPets(req, res) {

    //pega o usuario a partir do token dele
    const token = getToken(req);
    const user = await getUserByToken(token);

    //então faz uma busca nos pets que possui o userId igual o do usuario q solicitou
    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");
    return res.status(200).json({
      pets: pets,
    });
  }

  /*Pega todos os pets que o usuario adotou */
  static async getAllUserAdoptions(req, res) {

    //pega o usuario que solicitou a requisicao
    const token = getToken(req);
    const user = await getUserByToken(token);

    //então faz uma busca nos pets que possui o adopterID igual o do usuario q solicitou
    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    return res.status(200).json({
      pets: pets,
    });
  }

  /*Retorna o pet pelo id dele na nos parametros da requisicao pets/:id */
  static async getPetById(req, res) {
    const id = req.params.id;

    //verifica se o id é valido
    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: "Id invalido!" });
    }

    //verifica se o pet existe
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    //então retorna o pet caso ele exista
    return res.status(200).json({
      pet: pet,
    });
  }

  /*deleta o pet selecionado pelo id passado no parametro da url /pets/:id */
  static async removePetById(req, res) {
    const id = req.params.id;

    //verifica se o id é valido
    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: "Id invalido!" });
    }

    //verifica se o pet com aquelke id existe
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    //verifica se quem passou a requisicao querendo excluir o pet é dele mesmo
    const token = getToken(req);
    const user = await getUserByToken(token);

    //verifica se o dono do pet é o mesmo que solicitou sua exclusao
    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({ message: "Pet nao é do usuario logado!" });
    }

    //deleta o pet
    await Pet.findByIdAndDelete(id);

    return res.status(200).json({ message: "Pet deletado com sucesso" });
  }

  /*Atualizar as informaçoes do pet do usuario */
  static async updatePet(req, res) {

    //pega todas as informacoes passadas na url e no body e files
    const id = req.params.id;
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const updatedData = {};

    //verifica se o pet que quer editar existe
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    //verifica se o dono do pet é o mesmo que solicitou a edicao dele
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({ message: "Pet não é do usuario logado!" });
    }

    //validations
    if (!name || !age || !weight || !color) {
      return res
        .status(422)
        .json({
          message: "Todos os campos obrigátorios devem ser preenchidos",
        });
    }
    updatedData.name = name;
    updatedData.age = age;
    updatedData.weight = weight;
    updatedData.color = color;

    if (images.length > 0) {
      updatedData.images = [];
      images.map((img) => {
        updatedData.images.push(img.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updatedData);

    return res.status(200).json({ message: "pet atualizado com sucesso" });
  }

  /*Marcar agendamento do pet */
  static async schedule(req, res) {
    const id = req.params.id;

    //se o pet do id passado existe
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    //verifica se o dono do pet é o mesmo que solicitou o agendamento
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      return res.status(422).json({
        message: "Você não pode agendar uma visita com seu próprio Pet!",
      });
    }

    // verifica se o pet ja foi adotado ou não(se ele esta disponivel para editar)
    if (pet.adopter) {
      //verifica se o dono do pet já agendou para esse pet
      if (pet.adopter._id.equals(user._id)) {
        return res.status(422).json({
          message: "Você já agendou uma visita para este Pet!",
        });
      }
    }

    // adiciona o usuario como o adotador
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    }

    await Pet.findByIdAndUpdate(id, pet);

    return res.status(200).json({
      message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} no telefone: ${pet.user.phone}`,
    })
  }

  /*Conclui a adocao do pet */
  static async concludeAdoption(req, res) {
    const id = req.params.id;

    //check if pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado!" });
    }

    pet.available = false

    await Pet.findByIdAndUpdate(id, pet);

    return res.status(200).json({
      pet: pet,
      message: `Parabéns! O ciclo de adoção foi finalizado com sucesso!`,
    })
  }
};
