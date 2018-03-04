import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { NgRedux } from 'ng2-redux'
import { IAppState } from '../store'

import { CarsActions } from '../store/cars/cars.actions'

import { CarReviewModel } from './car-review.model'
import {AuthService} from '../core/auth.service'

@Component({
    selector: 'car-details',
    templateUrl: './car-details.component.html'
})
export class CarDetailsComponent implements OnInit {
    private carId: number;
    car: object = {};
    reviews: Array<object> = [];
    review: CarReviewModel = new CarReviewModel(5);
    likesCount: number;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private carsActions: CarsActions,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                const id = params['id']

                this.carsActions.details(id)
                this.carsActions.allReviews(id)

                this.ngRedux
                    .select(state => state.cars)
                    .subscribe(cars => {
                        this.car = cars.carDetails;
                        this.reviews = cars.carReviews.map(function(item){
                            return JSON.parse(item + '');
                        });
                        this.likesCount = cars.carDetails['likes']? cars.carDetails['likes'].length : 0;
                    })
            })
    }

    like() {
        this.carsActions.like(this.car['_id'], this.authService.getUser());
    }

    submitReview() {
        this.carsActions.submitReview(this.car['_id'], this.review, this.authService.getUser());
    }
}