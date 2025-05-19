import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpSuccessInterceptor } from './common/interceptor/http/http.success.interceptor';
import { ExceptionFilter } from './common/filter/exception.filter';
import { GatewayModule } from './gateway.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { GatewayAuthService } from './modules/auth/gateway.auth.service';
import { RoleGuard } from './modules/auth/guard/role.guard';

class Server {
    private configService: ConfigService;

    constructor(private readonly app: NestExpressApplication) {
        this.app = app;
        this.init();
    }

    private init() {
        this.configService = this.app.get<ConfigService>(ConfigService);

        this.setupCors();
        this.setupSwagger();
        this.setupGlobalInterceptor();
        this.setupGlobalFilter();
        this.setupGlobalGuard();
        this.setupGlobalPipe();
    }

    private setupSwagger() {
        const config = new DocumentBuilder()
            .setTitle(this.configService.get<string>('SWAGGER_TITLE'))
            .setDescription(this.configService.get<string>('SWAGGER_DESCRIPTION'))
            .setVersion(this.configService.get<string>('SWAGGER_VERSION'))
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                in: 'headers',
            })
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    in: 'headers',
                },
                'refreshToken',
            )
            .build();

        const document = SwaggerModule.createDocument(this.app, config);
        SwaggerModule.setup(this.configService.get<string>('SWAGGER_PATH'), this.app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }

    private setupCors() {
        this.app.enableCors({
            origin: '*',
            methods: 'GET,POST,PUT,PATCH,DELETE',
        });
    }

    private setupGlobalInterceptor() {
        this.app.useGlobalInterceptors(
            new ClassSerializerInterceptor(this.app.get(Reflector)),
            new HttpSuccessInterceptor(),
        );
    }

    private setupGlobalFilter() {
        this.app.useGlobalFilters(new ExceptionFilter());
    }

    private setupGlobalPipe() {
        this.app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: false,
            }),
        );
    }

    private setupGlobalGuard() {
        this.app.useGlobalGuards(
            new AuthGuard(this.app.get(GatewayAuthService), this.app.get(Reflector)),
            new RoleGuard(this.app.get(Reflector)),
        );
    }

    async start(): Promise<void> {
        await this.app.listen(this.configService.get<number>('HTTP_PORT'));
    }
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
    const server = new Server(app);
    await server.start();
}

bootstrap()
    .then(() => {
        if (process.env.NODE_ENV === 'production') {
            process.send('ready');
        }

        new Logger(process.env.NODE_ENV).log(`✅ Server on http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`);
    })
    .catch(error => {
        new Logger(process.env.NODE_ENV).error(`❌ Server error ${error}`);
    });
