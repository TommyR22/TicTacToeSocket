import { Observable } from 'rxjs/Rx';
import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

@Injectable()
export class HttpInterceptorApp implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.sharedService.displayLoader(true);
    //req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded '), body: body.toString() });
    return next.handle(req)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          console.log('processing response', ev);
        }
      })
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          console.error('Processing http error', response);
        }
        return Observable.throw(response);
      });
      // .finally(() => this.sharedService.displayLoader(false));
  }
}
