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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  imageExtension = 'svg';
  user: User;
  step: number;
  title = 'app';
  username: string;
  roomName: string;
  rooms = [];
  clients = [];
  avatarNumber: string;
  srcAvatar: string;
  showNotify = false;
  showLoader = false;
  footerLabel = 'Start Game!';
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
    this.sharedService.changeEmittedStep$.subscribe(
      step => {
        console.log('[HomeComponent] STEP', step);
        this.step = step;
      });
    // init step
    this.sharedService.emitChangeStep(1);
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
      console.log('User:', JSON.stringify(this.user));
      this.gameService.setUser(this.user);
      this.socketService.newPlayer(this.socket, this.user);
      this.updateRooms();
      this.sharedService.emitChangeStep(this.step += 1);
    });
    this.socket.on('connect_failed', () => {
      console.log('Connection fail');
      this.showNotify = true;
      this.notifyText = 'Connection Fail';
      this.notifyTitle = 'Error';
      this.notifyType = 'error';
    });
    this.socket.on('connect_error', () => {
      console.log('Server Offline');
      this.showNotify = true;
      this.notifyText = 'Server Offline';
      this.notifyTitle = 'Error';
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
    this.socket.on('clients.update_clients', (data) => {
      if (data.length === 0) {
        this.clients = [];
        console.log('No clients!');
      } else {
        this.clients = [];
        for (const client of data) {
          if (client.name !== this.username) {
            this.clients.push(client);
          }
        }
      }
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
  }

  getTimeAgo(timestamp: Date) {
    return moment(timestamp).fromNow();
  }

  onSubmit(step: number, form: any) {
    // console.log(form.value);
    if (this.step === 1) {
      console.log('initSocket');
      this.initSocket();
    } else if (this.step === 2) {
      console.log('createRoom');
      let found = false;
      for (let room of this.rooms) {
        if (room.name === this.roomName) {
          this.showNotify = true;
          this.notifyText = 'Another room with same name alreay exist!';
          this.notifyTitle = 'Change Name Room';
          this.notifyType = 'info';
          found = true;
          break;
        }
      }
      if (!found) {
        this.socketService.setRoom(this.roomName);
        this.socketService.newRoom(this.socket, this.roomName, this.user);
        this.sharedService.setRoomName(this.roomName);
        this.sharedService.emitChangeStep(this.step += 1);
        setTimeout(() => {
          this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span>Welcome to room: <b>' + this.roomName + '</b></span><br/>');
        }, 300);
      }
    }
  }

  updateRooms() {
    this.socketService.updateRooms(this.socket);
  }

  joinRoom(room: any) {
    if (room.nclients === 2) {
      this.showNotify = true;
      this.notifyText = 'Full room';
      this.notifyTitle = 'The room selected is full.';
      this.notifyType = 'info';
    } else {
      this.socketService.setRoom(room.name);
      this.roomName = room.name;
      this.sharedService.setRoomName(this.roomName);
      this.socketService.joinRoom(this.socket, room.name);
      this.sharedService.emitChangeStep(this.step += 1);
      setTimeout(() => {
        this.elRef.nativeElement.querySelector('.container-body_chat').insertAdjacentHTML('beforeend', '<span>Welcome to room: <b>' + room.name + '</b></span><br/>');
      }, 300);
      this.updateClients();
    }
  }

  updateClients() {
    this.socketService.updateClients(this.socket, this.roomName);
  }

  startGame() {
    this.socketService.startGame(this.socket, this.roomName);
  }

  setAvatar(avatar: string) {
    this.avatarNumber = avatar.split('avatar')[1];
    this.srcAvatar = `../assets/images/avatars/${this.avatarNumber}.${this.imageExtension}`;
  }

  closeNotify(value: boolean) {
    this.showNotify = value;
  }

}

