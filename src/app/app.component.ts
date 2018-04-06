import {Component, OnInit} from '@angular/core';
import {environment} from './../environments/environment.prod';
import {SocketService} from './core/socket.service';
import {SharedService} from './core/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  socket: any;
  step = 1;
  roomName: string;

  constructor(private socketService: SocketService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.changeEmittedStep$.subscribe(
      step => {
        console.log('[AppComponent] STEP', step);
        this.step = step;
      });
  }

  updateRooms() {
    this.socket = this.socketService.getSocket();
    this.socketService.updateRooms(this.socket);
  }

  exitRoom() {
    if (this.step === 2) {
      this.step -= 1;
      this.sharedService.emitChangeStep(this.step);
    }else if (this.step === 3) {
      this.socket = this.socketService.getSocket();
      this.roomName = this.sharedService.getRoomName();
      this.socketService.exitRoom(this.socket, this.roomName);
      this.step -= 1;
      this.sharedService.emitChangeStep(this.step);
    }
  }

}
