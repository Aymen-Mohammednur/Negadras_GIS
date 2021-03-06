const User = require("../models/User");

exports.getUsers = async(req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}