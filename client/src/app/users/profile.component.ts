import { Component, OnInit } from '@angular/core'

import { NgRedux } from 'ng2-redux'
import { CarsActions } from '../store/cars/cars.actions'
import { IAppState } from '../store'
import {AuthService} from '../core/auth.service'

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    cars: Array<object> = []

    constructor(
        private carsActions: CarsActions,
        private authService: AuthService,
        private ngRedux: NgRedux<IAppState>
    ) { }

    ngOnInit() {
        this.carsActions.mine(this.authService.getUser());

        this.ngRedux
            .select(state => state.cars.myCars)
            .subscribe(cars => {
                this.cars = cars['cars']
            })
    }

    delete(id) {
        this.carsActions.delete(id);
    }
}