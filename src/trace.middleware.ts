import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
    constructor(@InjectSentry() private readonly sentry: SentryService) {}
    use(req: Request, res: Response, next: NextFunction): void {
        const transaction = this.sentry.instance().startTransaction({
        op: 'request',
        name: req.url,
        });

        this.sentry.instance().getCurrentHub().configureScope(scope => {
            scope.addEventProcessor(event => {
                event.request = {
                method: req.method,
                url: req.url,
                };
                return event;
            });
        });

        this.sentry.instance().configureScope(scope => {
            scope.setSpan(transaction);
        });

        req.on('close', () => {
            transaction.setHttpStatus(res.statusCode);
            transaction.finish();
        });

        next();
    }
}
