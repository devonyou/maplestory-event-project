import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { format } from 'date-fns';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: () => void) {
        const { ip, method, originalUrl, httpVersion, headers } = req;
        const { 'user-agent': userAgent } = headers;
        const { statusCode } = res;
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        this.logger.log(
            `${timestamp} - - ${ip} "${method} ${originalUrl} HTTP/${httpVersion} ${statusCode}" - ${userAgent}`,
        );

        if (res.errored) {
            return res.send(res.errored);
        }

        next();
    }
}
