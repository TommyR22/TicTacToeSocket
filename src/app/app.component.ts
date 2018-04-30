import {Component, OnInit} from '@angular/core';
import {environment} from './../environments/environment.prod';
import {SocketService} from './core/socket.service';
import {SharedService} from './core/shared.service';
import {Router} from '@angular/router';

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
                private sharedService: SharedService,
                private router: Router) {
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

    exitRoom(step: number) {
        if (step === 1) {
            this.socket = this.socketService.getSocket();
            this.sharedService.emitChangeStep(0);
            this.socketService.exit(this.socket);
            this.router.navigate(['/login']);
        } else if (step === 2) {
            this.socket = this.socketService.getSocket();
            this.roomName = this.sharedService.getRoomName();
            this.socketService.exitRoom(this.socket, this.roomName);
            this.sharedService.emitChangeStep(1);
            this.router.navigate(['/home']);
        }
    }

}
