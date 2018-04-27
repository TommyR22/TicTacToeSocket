import {GameService} from './../core/game.service';
import {SocketService} from '../core/socket.service';
import {Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment.prod';
import * as moment from 'moment';
import {User} from '../core/models/user.model';
import {Router} from '@angular/router';
import {SharedService} from '../core/shared.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked {
    imageExtension = 'svg';
    user: User;
    title = 'app';
    username: string;
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
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    /**
     * init socket for client
     */
    initSocket() {
        // init and connect socket client
        this.socket = io(this.url).connect();
        this.socketService.setSocket(this.socket);
        this.socket.on('connect', () => {
            console.log('Connection success:', this.socket.id);
            // this.showNotify = true;
            // this.notifyText = 'Connection Success';
            // this.notifyTitle = 'Success';
            // this.notifyType = 'success';
            this.user = new User(this.socket.id, this.username, this.avatarNumber);
            this.sharedService.setUser(this.user);
            console.log('User:', JSON.stringify(this.user));
            this.gameService.setUser(this.user);
            this.socketService.newPlayer(this.socket, this.user);
            // this.updateRooms();
            this.sharedService.emitChangeStep(1);
            this.router.navigate(['/home']);
        });
        this.socket.on('connect_failed', () => {
            console.log('Connection fail');
            this.showNotify = true;
            this.notifyTitle = 'Connection Fail';
            this.notifyType = 'error';
        });
        this.socket.on('connect_error', () => {
            console.log('Server Offline');
            this.showNotify = true;
            this.notifyTitle = 'Server Offline';
            this.notifyType = 'error';
        });

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

    }

    getTimeAgo(timestamp: Date) {
        return moment(timestamp).fromNow();
    }

    onSubmit(step: number, form: any) {
        // console.log(form.value);
        console.log('initSocket');
        this.initSocket();
    }

    // updateRooms() {
    //     this.socketService.updateRooms(this.socket);
    // }

    setAvatar(avatar: string) {
        this.avatarNumber = avatar.split('avatar')[1];
        this.srcAvatar = `../assets/images/avatars/${this.avatarNumber}.${this.imageExtension}`;
    }

    closeNotify(value: boolean) {
        this.showNotify = value;
    }

}

