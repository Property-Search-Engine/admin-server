const Joi = require("joi")

const updateUserSchema = Joi.object({
    firstname: Joi.string().min(3).max(255).required(),
    lastname: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(6).max(255).required(),
});

const registerUserSchema = Joi.object({
    _id: Joi.string(),
    firstname: Joi.string().min(3).max(255).required(),
    lastname: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(255).trim().required()
});

async function validateRegisterData(req, res, next) {
    try {
        req.body = await registerUserSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next({ statusCode: 400, message: err.details });
    }
}

async function validateUpdateData(req, res, next) {
    try {
        req.body = await updateUserSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next({ statusCode: 400, message: err.details });
    }
}

module.exports = { validateRegisterData, validateUpdateData };
