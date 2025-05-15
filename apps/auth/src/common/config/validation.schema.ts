import * as Joi from 'joi';

export default Joi.object({
    GRPC_HOST: Joi.string().required(),
    GRPC_PORT: Joi.number().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
    MONGO_URL: Joi.string().required(),
});
