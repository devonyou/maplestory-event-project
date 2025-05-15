import * as Joi from 'joi';

export default Joi.object({
    HTTP_HOST: Joi.string().required(),
    HTTP_PORT: Joi.number().required(),
    SWAGGER_PATH: Joi.string().required(),
    SWAGGER_TITLE: Joi.string().required(),
    SWAGGER_DESCRIPTION: Joi.string().required(),
    SWAGGER_VERSION: Joi.string().required(),
    AUTH_GRPC_HOST: Joi.string().required(),
    AUTH_GRPC_PORT: Joi.number().required(),
});
