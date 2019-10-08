import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { UserDataService } from './user-data.service';

export class AuthInterceptorService implements HttpInterceptor{

    constructor(private userDataService: UserDataService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      
        if((req.url === 'https://bsviraj-task-manager.herokuapp.com/users') || (req.url === 'https://bsviraj-task-manager.herokuapp.com/users/login')){
            return next.handle(req)
        }

        const modReq = req.clone({headers: req.headers.append("Authorization", "Bearer " + this.userDataService.authToken)})
        return next.handle(modReq);
    }

}