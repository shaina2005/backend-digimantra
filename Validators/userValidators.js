import Joi from "joi"

export const addUserSchema = Joi.object({

    email : Joi.string().email().required(),
    name : Joi.string().min(3).max(30).required(),
    password : Joi.string().min(8).pattern( new RegExp ('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$') ).required(),

})