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
    EVENT_GRPC_HOST: Joi.string().required(),
    EVENT_GRPC_PORT: Joi.number().required(),
    BOSS_GRPC_HOST: Joi.string().required(),
    BOSS_GRPC_PORT: Joi.number().required(),
    ATTENDANCE_GRPC_HOST: Joi.string().required(),
    ATTENDANCE_GRPC_PORT: Joi.number().required(),
});
