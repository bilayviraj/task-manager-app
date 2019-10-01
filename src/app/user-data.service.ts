import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserDataService {
    user;
    authToken;
    isSignedIn: Boolean;

    saveUserData(userData) {
        this.user = userData['user'];
        this.authToken = userData['token'];
        this.isSignedIn = true;
    }
}