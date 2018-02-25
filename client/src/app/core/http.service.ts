import { Injectable } from '@angular/core'
import { Http, RequestOptions, Headers } from '@angular/http'

import { AuthService } from './auth.service'

import 'rxjs/add/operator/map'

const baseUrl = 'http://localhost:5000/'
const getMethod = 'get';
const postMethod = 'post';

@Injectable()
export class HttpService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) { }

    get(url, authenicated = false) {
        const requestOptions = this.getRequestOptions(getMethod, authenicated);

        return this.http
            .get(`${baseUrl}${url}`, requestOptions)
            .map(res => res.json())
    }

    post(url, data, authenicated = false) {
        const requestOptions = this.getRequestOptions(postMethod, authenicated);

        return this.http
            .post(`${baseUrl}${url}`, JSON.stringify(data), requestOptions)
            .map(res => res.json())
    }

    private getRequestOptions(method, authenicated) {
        const headers = new Headers();

        if (method !== getMethod) {
            headers.append('Content-Type', 'application/json')
        }

        if (authenicated) {
            const token = this.authService.getToken()
            headers.append('Authorization', `bearer ${token}`)
        }

        const requestOptions = new RequestOptions({
            headers: headers
        })

        return requestOptions;
    }
}