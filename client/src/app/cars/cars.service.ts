import { Injectable } from '@angular/core'

import { HttpService } from '../core/http.service'

@Injectable()
export class CarsService {
    constructor(private httpService: HttpService) { }

    addCar(car) {
        return this.httpService.post('cars/add', car, true)
    }

    allCars(page = 1, search = null) {
        let url = `cars/all?page=${page}`
        if (search) {
            url += `&search=${search}`
        }
        return this.httpService.get(url)
    }

    details(id) {
        return this.httpService.get(`cars/${id}`, true)
    }

    like(id) {
        return this.httpService.post(`cars/like/${id}`, true)
    }

    allReviews(id) {
        return this.httpService.get(`cars/review/${id}`, true)
    }

    submitReview(id, review) {
        return this.httpService.post(`cars/details/${id}/reviews/create`,
            review,
            true)
    }

    mine() {
        return this.httpService.get('cars/mine', true)
    }

    delete(id) {
        return this.httpService.post(`cars/delete/${id}`, {}, true)
    }
}