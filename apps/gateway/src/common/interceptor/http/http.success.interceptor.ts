import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class HttpSuccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map(data => {
                return {
                    success: true,
                    statusCode: response.statusCode,
                    data,
                };
            }),
        );
    }
}
