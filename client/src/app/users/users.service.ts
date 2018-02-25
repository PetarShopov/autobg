import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service'

@Injectable()
export class UsersService {
    constructor(private httpService: HttpService) { }

    register(user) {
        return this.httpService.post('users/register', user)
    }

    login(user) {
        return this.httpService.post('users/login', user)
    }
}