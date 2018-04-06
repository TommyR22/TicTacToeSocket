import { game_routing } from './game.routing';
import { GameComponent } from './../game/game.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    game_routing,
    SharedModule
  ],
  declarations: [
    GameComponent
  ],
  providers: [],
  exports: []
})
export class GameModule { }
