const User = require("../models/User")

module.exports = class UserController {

    static async register(req, res) {
        return res.json({
            error: false,
            message: "good"
        })
    }
}