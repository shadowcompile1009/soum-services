import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcRetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      retry({
        count: Number(process.env.GRPC_RETRY),
        delay: (_, retryIndex) => {
          const d =
            Math.pow(2, retryIndex - 1) * Number(process.env.GRPC_RETRY_DELAY);
          return timer(d);
        },
      }),
      catchError((error) => {
        if (error.code === status.UNAVAILABLE) {
          return throwError(() => error);
        }
        return throwError(() => error);
      }),
    );
  }
}
