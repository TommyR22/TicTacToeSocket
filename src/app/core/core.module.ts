import { SocketService } from './socket.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from './game.service';
import { SharedService } from './shared.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
  ],
  providers: [SocketService, GameService, SharedService],
  exports: []
})
export class CoreModule { }
