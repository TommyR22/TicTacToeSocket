import { GameComponent } from './game.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';

const GAME_ROUTER: Routes = [
    {
        path: '',
        component: GameComponent
    }
];

export const game_routing: ModuleWithProviders = RouterModule.forChild(GAME_ROUTER);
