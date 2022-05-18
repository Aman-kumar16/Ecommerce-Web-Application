import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authenticationService: AuthenticationService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let newReq = req;
        let token = this.authenticationService.getToken();
        console.log("Inside auth Interceptor " + token);

        if(token != null){
            newReq = req.clone({
                headers: req.headers.set("Authorization", "Bearer "+ token )
            });
        }

        return next.handle(newReq);
    }
    

}