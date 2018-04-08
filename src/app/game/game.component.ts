import { User } from './../core/models/user.model';
import { GameService } from './../core/game.service';
import { SocketService } from './../core/socket.service';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Card } from '../core/models/card.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  imageExtension = 'svg';
  srcAvatarUser2: string;
  srcAvatarUser: string;

  user2: User;

  points: any;

  socket: any;
  nameRoom: string;
  user: User;
  data: any;
  clients = [];

  myTurn: boolean;

  turn_user2: string;
  turn_user: string;

  nvictory_user: number;
  nvictory_user2: number;

  seed: number;

  matrix = [];

  constructor(private socketService: SocketService,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.nvictory_user = 0;
    this.nvictory_user2 = 0;
    try {
      this.socket = this.socketService.getSocket();
      this.nameRoom = this.socketService.getRoom();
      this.user = this.gameService.getUser();
      this.data = this.gameService.getData();

      this.clients = this.data.players;
      for (const player of this.clients) {
        if (player.name === this.user.name) {
          this.user = new User(player.id, player.name, player.avatar);
          this.srcAvatarUser = `../assets/images/avatars/${player.avatar}.${this.imageExtension}`;
        } else {
          this.user2 = new User(player.id, player.name, player.avatar);
          this.srcAvatarUser2 = `../assets/images/avatars/${player.avatar}.${this.imageExtension}`;
        }
      }

      console.log('***', JSON.stringify(this.data));

      this.matrix = this.data.matrix;

      if (this.data.turn.name === this.user.name) {
        this.myTurn = true;
        this.turn_user2 = 'wait';
        this.turn_user = 'play';
        this.seed = this.data.seed1;
      } else {
        this.turn_user2 = 'play';
        this.turn_user = 'wait';
        this.seed = this.data.seed2;
      }

      if (this.seed === 1) {


      } else {

      }

      this.socket.on('send.message.from', (data) => {
        console.warn(data);
      });

    } catch (e) {
      this.router.navigate(['/home']);
    }


  }


}
