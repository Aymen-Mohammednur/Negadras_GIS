const Pin = require('../models/Pin')

// @desc Create a pin
// @route POST /api/v1/pins
// @access Public
exports.createPin = async (req, res, next) => {
    try {
        console.log("Controller");
        const newPin = await Pin.create(req.body);
        console.log(newPin);
        return res.status(200).json({
            success: true,
            data: newPin
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

// @desc Get all pins
// @route GET /api/v1/pins
// @access Public
exports.getPins = async (req, res, next) => {
    try {
        const pins = await Pin.find();
        return res.status(200).json({
            success: true,
            count: pins.length,
            data: pins
        });

    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.searchPins = async (req, res, next) => {
    try {
        const query = req.query.query;
        // console.log("QUEEERYYYYYYY", query)
        const pins = await Pin.find({
            $or: [
              { place: new RegExp(`^${query}$`, 'i') },
              { category: new RegExp(`^${query}$`, 'i') },
            ],
          });
        // console.log(pins)
        return res.status(200).json({
            success: true,
            count: pins.length,
            data: pins
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.searchPinsByCategory = async (req, res, next) => {
    try {
        const query = req.query.query;
        // console.log("QUEEERYYYYYYY", query)
        const pins = await Pin.find({
            category: query
          });
        // console.log(pins)
        return res.status(200).json({
            success: true,
            count: pins.length,
            data: pins
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}