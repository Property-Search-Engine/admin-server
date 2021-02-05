const Joi = require("@hapi/joi")

const validateRegisterData = (req) => {
    const registerUserSchema = Joi.object({
        _id: Joi.string().min(6).max(255).required(),
        firstname: Joi.string().min(6).max(255).required(),
        lastname: Joi.string().min(6).max(255).required(),
        phone: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
    });
    var { error, value } = registerUserSchema.validate(req)
    if (error) return { error }
    return { value }
}

module.exports = {
    validateRegisterData,
}