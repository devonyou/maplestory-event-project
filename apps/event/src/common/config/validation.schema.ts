import * as Joi from 'joi';

export default Joi.object({
    GRPC_HOST: Joi.string().required(),
    GRPC_PORT: Joi.number().required(),
    MONGO_URL: Joi.string().required(),
});
