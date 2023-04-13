/*FUnção de getToken pega o token do header da requisicao e transfoma no token devido que o token vem da forma:
    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9tIiwiaWQiOiI2NDJlYzIwNGQ0ODI1ZWNhMGE4MjE5NmQiLCJpYXQiOjE2ODA3ODg0ODF9.XxoOfKJTEy-Iuwmk3XkRlMGlU5Y2_TKqBUsBAl_U3X0
    Então é preciso remover o Bearer e pegar somente o token
*/
const getToken = (req)=> {
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    return token
}

module.exports = getToken