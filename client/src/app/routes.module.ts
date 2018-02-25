import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PrivateRoute } from './core/private-route'

import { StatsComponent } from './stats/stats.component'
import { RegisterComponent } from './users/register.component'
import { LoginComponent } from './users/login.component'
import { ProfileComponent } from './users/profile.component'
import { AddCarComponent } from './cars/add-car.component'
import { ListCarsComponent } from './cars/list-cars.component'
import { CarDetailsComponent } from './cars/car-details.component'

const routes: Routes = [
    { path: '', component: StatsComponent },
    { path: 'users/register', component: RegisterComponent },
    { path: 'users/login', component: LoginComponent },
    { path: 'users/profile', component: ProfileComponent },
    {
        path: 'cars/add',
        component: AddCarComponent,
        canActivate: [PrivateRoute]
    },
    { path: 'cars/all', component: ListCarsComponent },
    { path: 'cars/:id', component: CarDetailsComponent }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CarRoutesModule { }