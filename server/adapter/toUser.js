const User = require("../models/User");

const toUser = (req) => {
    let {...val} = req.body;
    // console.log(val);
    // console.log(new User(val))
    return new User(val)
}

module.exports = {
    toUser
}