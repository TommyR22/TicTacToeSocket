import {GameService} from './../core/game.service';
import {SocketService} from '../core/socket.service';
import {Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment.prod';
import * as moment from 'moment';
import {User} from '../core/models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../core/shared.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
    imageExtension = 'svg';
    user: User;
    title = 'app';
    roomName: string;
    rooms = [];
    clients = [];
    avatarNumber: string;
    srcAvatar: string;
    showNotify = false;
    showLoader = false;
    notifyText: string;
    notifyTitle: string;
    notifyType: string;

    // socket component and url
    private url = environment.serverUrl;
    private socket;

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private socketService: SocketService,
                private gameService: GameService,
                private elRef: ElementRef,
                private renderer: Renderer2,
                private router: Router,
                private sharedService: SharedService) {
    }

    ngOnInit() {
        this.socket = this.socketService.getSocket();
        this.user = this.sharedService.getUser();
        this.srcAvatar = `../assets/images/avatars/${this.user.avatar}.${this.imageExtension}`;

        this.socket.on('rooms.update_clients', (data) => {
            if (data.length === 0) {
                this.rooms = [];
                console.log('No rooms available!');
            } else {
                console.log(JSON.stringify(data));
                this.rooms = data;
                console.log('New Rooms available - n.', this.rooms.length);
            }
        });

        this.updateRooms();
    }

    ngAfterViewChecked() {
        // TODO check error
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    getTimeAgo(timestamp: Date) {
        return moment(timestamp).fromNow();
    }

    onSubmit(step: number, form: any) {

        console.log('createRoom');
        let found = false;
        for (let room of this.rooms) {
            if (room.name === this.roomName) {
                this.showNotify = true;
                this.notifyText = 'Change Name Room ';
                this.notifyTitle = 'Another room with same name alreay exist!';
                this.notifyType = 'info';
                found = true;
                break;
            }
        }
        if (!found) {
            this.socketService.setRoom(this.roomName);
            this.socketService.newRoom(this.socket, this.roomName, this.user);
            this.sharedService.setRoomName(this.roomName);
            this.sharedService.emitChangeStep(2);
            this.router.navigate(['/room']);
        }
    }

    updateRooms() {
        this.socketService.updateRooms(this.socket);
    }

    joinRoom(room: any) {
        if (room.nclients === 2) {
            this.showNotify = true;
            this.notifyText = 'The room selected is full.';
            this.notifyTitle = 'Full room';
            this.notifyType = 'info';
        } else {
            this.socketService.setRoom(room.name);
            this.roomName = room.name;
            this.sharedService.setRoomName(this.roomName);
            this.socketService.joinRoom(this.socket, room.name);
            this.sharedService.emitChangeStep(2);
            this.router.navigate(['/room']);
        }
    }

    // updateClients() {
    //     this.socketService.updateClients(this.socket, this.roomName);
    // }

    // setAvatar(avatar: string) {
    //     this.avatarNumber = avatar.split('avatar')[1];
    //     this.srcAvatar = `../assets/images/avatars/${this.avatarNumber}.${this.imageExtension}`;
    // }

    closeNotify(value: boolean) {
        this.showNotify = value;
    }

}

