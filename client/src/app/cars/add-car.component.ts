import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { NgRedux } from 'ng2-redux'
import { IAppState } from '../store'

import { AddCarModel } from './add-car.model'

import { CarsActions } from '../store/cars/cars.actions'
import {AuthService} from '../core/auth.service'

@Component({
    selector: 'add-car',
    templateUrl: './add-car.component.html'
})
export class AddCarComponent {
    car: AddCarModel = new AddCarModel();

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private router: Router,
        private authService: AuthService,
        private carsActions: CarsActions
    ) { }

    addCar() {
        this.car.createdBy = this.authService.getUser();
        this.carsActions.addCar(this.car);
        let subscription = this.ngRedux
            .select(state => state.cars)
            .subscribe(cars => {
                if (cars.carAdded) {
                    const carId = cars.carAddedId;
                    subscription.unsubscribe();
                    this.router.navigateByUrl(`/cars/${carId}`)
                }
            })
    }
}