import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((response) => {
        const totalPages = Math.ceil(response.count / response.limit);
        const splitedUrl = req.url.split('?');
        const baseURL =
          (process.env.APP_HOST || 'localhost:3000') + splitedUrl[0];
        const queryParams =
          splitedUrl.length > 1
            ? '&' +
              splitedUrl[1]
                .split('&')
                .filter(
                  (value: string) =>
                    !value.startsWith('page') && !value.startsWith('limit'),
                )
                .join('&')
            : '';
        const res = {
          data: response.data,
          pageInfo: {
            totalCount: response.count,
            itemCount: response.data.length,
            itemsPerPage: response.limit,
            currentPage: response.page,
            totalPages: totalPages,
            links: {
              first: `${baseURL}?page=1&limit=${response.limit}${queryParams}`,
              last: `${baseURL}?page=${totalPages}&limit=${response.limit}${queryParams}`,
              next:
                response.page + 1 <= totalPages
                  ? `${baseURL}?page=${response.page + 1}&limit=${
                      response.limit
                    }${queryParams}`
                  : '',
              previous:
                response.page - 1
                  ? `${baseURL}?page=${response.page - 1}&limit=${
                      response.limit
                    }${queryParams}`
                  : '',
            },
          },
        };
        return res;
      }),
    );
  }
}
