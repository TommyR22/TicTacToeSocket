import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {User} from '../core/models/user.model';
import {SharedService} from '../core/shared.service';
import {SocketService} from '../core/socket.service';
import {GameService} from '../core/game.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    srcAvatar: string;
    imageExtension = 'svg';
    user: User;
    clients = [];
    socket: any;
    footerLabel: string;

    constructor(private sharedService: SharedService,
                private elRef: ElementRef,
                private renderer: Renderer2,
                private socketService: SocketService,
                private gameService: GameService,
                private router: Router) {
    }

    ngOnInit() {
        try {
            this.user = this.sharedService.getUser();
            this.srcAvatar = `../assets/images/avatars/${this.user.avatar}.${this.imageExtension}`;
            this.sharedService.changeEmittedClients$.subscribe(
                clients => {
                    this.clients = clients;
                });

            setTimeout(() => {
                const roomName = this.sharedService.getRoomName();
                this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span>Welcome to room: <b>' + roomName + '</b></span><br/>');
            }, 300);

            this.socket = this.socketService.getSocket();

            this.socket.on('clients.update_clients', (data) => {
                if (data.length === 0) {
                    this.clients = [];
                    console.log('No clients!');
                } else {
                    this.clients = [];
                    for (const client of data) {
                        if (client.name !== this.user.name) {
                            this.clients.push(client);
                        }
                    }
                }
                this.footerLabel = 'Start Game!';
            });

            this.socket.on('notifyPlayerJoin', (data) => {
                console.warn(data);
                this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span><b>' + data.newClient.name + '</b> join in.</span><br/>');
                this.clients = [];
                for (const client of data.clients) {
                    if (client.id !== this.user.id) {
                        this.clients.push(client);
                    }
                }
            });
            this.socket.on('notifyPlayerLeave', (data) => {
                console.warn(data);
                this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span><b>' + data.oldClient.name + '</b> has left the room.</span><br/>');
                this.clients = [];
                for (const client of data.clients) {
                    if (client.id !== this.user.id) {
                        this.clients.push(client);
                    }
                }
            });

            this.socket.on('notifyPlayerDisconnected', (data) => {
                console.warn(data);
                this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span><b>' + data.oldClient.name + '</b> disconnected!</span><br/>');
                this.clients = [];
                for (const client of data.clients) {
                    if (client.id !== this.user.id) {
                        this.clients.push(client);
                    }
                }
                if (this.router.url === '/game') {
                    this.router.navigate(['/home']);
                    // TODO sistemare
                }
            });

            this.socket.on('gameStart', (data) => {
                console.warn(data);
                this.sharedService.emitChangeLoader(true);
                this.footerLabel = 'Loading..';
                this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span>' + data.message + '</span><br/>');
                this.gameService.setData(data.data);
                setTimeout(() => {
                    this.sharedService.emitChangeLoader(false);
                    this.router.navigate(['/game']);
                }, 2000);
            });

            this.updateClients();
        } catch (e) {
            this.router.navigate(['/home']);
        }
    }

    updateClients() {
        this.socketService.updateClients(this.socket, this.sharedService.getRoomName());
    }

    startGame() {
        this.socketService.startGame(this.socket, this.sharedService.getRoomName());
    }

}
