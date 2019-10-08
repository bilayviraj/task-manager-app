import { Injectable } from '@angular/core';
import { OfflineDataService } from './offline-data.service';

interface userData {
    user: {
        _id: string,
        name: string,
        email: string,
        age: number,
        createdAt: string,
        updatedAt: string
    },
    token: string
}

@Injectable({providedIn: 'root'})
export class UserDataService {
    userDetails;
    authToken;
    isSignedIn: Boolean;

    constructor(private offlineDataService: OfflineDataService) {}

    saveUserData(userData) {
        this.userDetails = userData['user'];
        this.authToken = userData['token'];
        this.isSignedIn = true;
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    autoLogin() {
        const userData: {
            user: {
                _id: string,
                name: string,
                email: string,
                age: number,
                createdAt: string,
                updatedAt: string
            },
            token: string
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }

        this.saveUserData(userData);
        this.offlineDataService.loadTasks();

    }
}