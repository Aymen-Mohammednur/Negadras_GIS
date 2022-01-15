const Pin = require("../models/Pin");

const toPin = (req) => {
    let {...val} = req.body;
    return new Pin(val)
}

module.exports = {
    toPin
}