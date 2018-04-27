import {HomeComponent} from './home/home.component';
import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomComponent} from './room/room.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'room',
        component: RoomComponent
    },
    {
        path: 'game',
        loadChildren: 'app/game/game.module#GameModule'
    },
    {
        path: '**',
        pathMatch: 'full',
        component: AppComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
