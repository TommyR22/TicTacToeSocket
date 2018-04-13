import {User} from './../core/models/user.model';
import {GameService} from './../core/game.service';
import {SocketService} from './../core/socket.service';
import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import {Router} from '@angular/router';
import {SharedService} from '../core/shared.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    imageExtension = 'svg';
    srcAvatarUser2: string;
    srcAvatarUser: string;
    srcSeedUser: string;
    srcSeedUser2: string;
    colorTextUser: string;
    colorTextUser2: string;

    user2: User;

    points: any;

    socket: any;
    nameRoom: string;
    user: User;
    data: any;
    clients = [];

    myTurn: boolean;
    userCurrentTurn: string;
    turn_user2: string;
    turn_user: string;

    nvictory_user: number;
    nvictory_user2: number;

    seed: number;

    matrix = [];

    progressWidth = 0;
    progressInterval;
    timerSeconds = 3;

    constructor(private socketService: SocketService,
                private gameService: GameService,
                private router: Router,
                private sharedService: SharedService) {
    }

    ngOnInit() {
        this.nvictory_user = 0;
        this.nvictory_user2 = 0;
        try {
            this.socket = this.socketService.getSocket();
            this.nameRoom = this.socketService.getRoom();
            this.user = this.gameService.getUser();
            this.data = this.gameService.getData();
            console.log('USER:', this.user);

            this.clients = this.data.players;
            for (const player of this.clients) {
                if (player.id === this.user.id) {
                    this.user = new User(player.id, player.name, player.avatar);
                    this.srcAvatarUser = `../assets/images/avatars/${player.avatar}.${this.imageExtension}`;
                } else {
                    this.user2 = new User(player.id, player.name, player.avatar);
                    this.srcAvatarUser2 = `../assets/images/avatars/${player.avatar}.${this.imageExtension}`;
                }
            }

            console.log('***', JSON.stringify(this.data));

            this.matrix = this.data.matrix;
            this.userCurrentTurn = this.data.turn;
            if (this.data.turn.name === this.user.name) {
                this.myTurn = true;
                this.turn_user2 = 'wait';
                this.turn_user = 'play';
                this.seed = this.data.seed1;
            } else {
                this.myTurn = false;
                this.turn_user2 = 'play';
                this.turn_user = 'wait';
                this.seed = this.data.seed2;
            }

            if (this.seed === 1) {
                this.srcSeedUser = `../assets/images/x.png`;
                this.srcSeedUser2 = `../assets/images/o.png`;
                this.colorTextUser = '#dc685a';
                this.colorTextUser2 = '#1abc9c';
            } else {
                this.srcSeedUser = `../assets/images/o.png`;
                this.srcSeedUser2 = `../assets/images/x.png`;
                this.colorTextUser2 = '#dc685a';
                this.colorTextUser = '#1abc9c';
            }

            /**
             * get Data
             */
            this.socket.on('send.message.from', (data) => {
                console.warn(data);
                this.userCurrentTurn = data.turn;
                if (data.turn.id === this.user.id) {
                    this.myTurn = true;
                    this.turn_user2 = 'wait';
                    this.turn_user = 'play';
                } else {
                    this.myTurn = false;
                    this.turn_user2 = 'play';
                    this.turn_user = 'wait';
                }

                this.matrix = data.matrix;
                this.sharedService.emitChangeMatrix(this.matrix);

                if (data.winner !== '') {
                    // todo check winner
                }else {
                    /**
                     * Loader
                     */
                    if (this.myTurn) {
                        const start = new Date().valueOf();
                        const duration = 3 * 1000;
                        const end = start + duration;
                        let now = start;
                        this.progressInterval  = setInterval(() => {
                            now = new Date().valueOf();
                            this.progressWidth = ((now - start) / (end - start)) * 100;
                            if (now >= end) {
                                this.progressWidth = 0;
                                // clearInterval(this.progressInterval);
                                for (let i = 0; i < this.matrix.length; i++) {
                                    if (this.matrix[i] === 0) {
                                        this.cubeSelected(i);
                                        break;
                                    }else if (i === 8) {    // last element
                                        this.progressWidth = 0;
                                        clearInterval(this.progressInterval);
                                    }
                                }
                            }
                        }, 10);
                    }
                }

            });

            /**
             * Loader
             */
            if (this.myTurn) {
                const start = new Date().valueOf();
                const duration = this.timerSeconds * 1000;
                const end = start + duration;
                let now = start;
                this.progressInterval  = setInterval(() => {
                    now = new Date().valueOf();
                    this.progressWidth = ((now - start) / (end - start)) * 100;
                    if (now >= end) {
                        this.progressWidth = 0;
                        // clearInterval(this.progressInterval);
                        for (let i = 0; i < this.matrix.length; i++) {
                            if (this.matrix[i] === 0) {
                                this.cubeSelected(i);
                                break;
                            }
                        }
                    }
                }, 10);
            }

        } catch (e) {
            this.router.navigate(['/home']);
        }
    }

    cubeSelected(cube: number) {
        this.progressWidth = 0;
        clearInterval(this.progressInterval);
        this.matrix[cube] = this.seed;
        // console.log('[cubeSelected] Matrix:', this.matrix);
        // TODO check if win and set WINNER
        this.socketService.send(this.socket, this.nameRoom, {matrix: this.matrix, userCurrentTurn: this.userCurrentTurn, winner: ''});
    }


}
