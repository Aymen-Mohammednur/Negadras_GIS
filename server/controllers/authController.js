const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { toUser } = require('../adapter/toUser')

const {
    registerValidation,
    loginValidation,
} = require("../middlewares/validation");

const register = async (req, res, next) => {
    const { error } = registerValidation(req.body);

    if (error) {
        // console.log("ERROR: ", error);
        return res.status(400).send({ message: error.details[0].message });
    }
    // Checking if the user is already in the database
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists)
        return res.status(400).send({ message: "Username already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    // const user = new User({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: hashedPassword,
    // });

    const user = toUser(req)
    user.password = hashedPassword

    try {
        const savedUser = await user.save();
        return res.status(200).json({
            success: true,
            data: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
};

const login = async (req, res, next) => {
    // Lets validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).send({ message: "Username or password is wrong" });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send({ message: "Username or password is wrong" });

    // Create and assign a token
    // const token = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
    //     expiresIn: "30m",
    //     algorithm: "HS256",
    // });

    res.status(200).json({
        id: user._id,
        username: user.username
    });
};

module.exports = {
    register,
    login,
};
