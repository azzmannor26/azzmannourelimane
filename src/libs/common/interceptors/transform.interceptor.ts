import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const excludePaths = ['thumbnail', 'logos', 'document'];

    const request = context.switchToHttp().getRequest();
    if (request.method === 'GET') {
      const path = request.url; // This will give you the full URL path

      // Check if the path is in the excludePaths array or matches any dynamic path
      const isExcluded = excludePaths.some((excludePath) =>
        path.includes(excludePath),
      );
      if (isExcluded) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => {
        if (data.data) {
          return {
            statusCode,
            timestamp: new Date().toISOString(),
            ...data,
          };
        } else {
          return {
            statusCode,
            timestamp: new Date().toISOString(),
            data,
          };
        }
      }),
    );
  }
}
