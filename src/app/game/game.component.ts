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

    showResult = false;
    messageResult: string;

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

                if (data.rematch === 'enable') {
                    this.showResult = false;
                    this.sharedService.emitChangeReset();
                }

                this.sharedService.emitChangeMatrix(this.matrix);

                if (data.winner !== '') {
                    if (data.winner === this.user.id) {
                        // TODO check WINNER
                        console.log('You WON!');
                        this.messageResult = 'You Win!';
                        this.nvictory_user += 1;
                        this.showResult = true;
                    } else if (data.winner === 'tie') {
                        // TODO check TIE
                        console.log('Tie!');
                        this.messageResult = 'It\'s a Tie!';
                        this.showResult = true;
                    } else {
                        // TODO check LOSER
                        console.log('You LOSE!');
                        this.messageResult = 'You Lose!';
                        this.nvictory_user2 += 1;
                        this.showResult = true;
                    }
                } else if (this.myTurn) {
                    this.startTimer();
                }
            });
            if (this.myTurn) {
                this.startTimer();
            }
        } catch (e) {
            this.router.navigate(['/home']);
        }
    }

    startTimer() {
        const start = new Date().valueOf();
        const duration = this.timerSeconds * 1000;
        const end = start + duration;
        let now = start;
        this.progressInterval = setInterval(() => {
            now = new Date().valueOf();
            this.progressWidth = ((now - start) / (end - start)) * 100;
            if (now >= end) {
                this.progressWidth = 0;
                // clearInterval(this.progressInterval);
                for (let i = 0; i < this.matrix.length; i++) {
                    if (this.matrix[i] === 0) {
                        this.cubeSelected(i);
                        break;
                    } else if (i === 8) {    // last element
                        this.progressWidth = 0;
                        clearInterval(this.progressInterval);
                        this.socketService.send(this.socket, this.nameRoom, {
                            matrix: this.matrix,
                            userCurrentTurn: this.userCurrentTurn,
                            winner: 'tie',
                            rematch: ''
                        });
                    }
                }
            }
        }, 10);
    }

    cubeSelected(cube: number) {
        this.progressWidth = 0;
        clearInterval(this.progressInterval);
        this.matrix[cube] = this.seed;
        // console.log('[cubeSelected] Matrix:', this.matrix);
        const result = this.checkResult(this.matrix);
        if (result) {
            this.socketService.send(this.socket, this.nameRoom, {
                matrix: this.matrix,
                userCurrentTurn: this.userCurrentTurn,
                winner: this.user.id,
                rematch: ''
            });
        } else {
            this.socketService.send(this.socket, this.nameRoom, {
                matrix: this.matrix,
                userCurrentTurn: this.userCurrentTurn,
                winner: '',
                rematch: ''
            });
        }
    }

    checkResult(matrix: any) {
        let end = false;
        if (matrix[0] === this.seed) {
            if (matrix[1] === this.seed && matrix[2] === this.seed) { // row 1
                end = true;
            } else if (matrix[3] === this.seed && matrix[6] === this.seed) { // col 1
                end = true;
            } else if (matrix[4] === this.seed && matrix[8] === this.seed) { // diagonal 1
                end = true;
            }
        }
        if (matrix[1] === this.seed) {
            if (matrix[4] === this.seed && matrix[7] === this.seed) { // col 2
                end = true;
            }
        }
        if (matrix[2] === this.seed) {
            if (matrix[5] === this.seed && matrix[8] === this.seed) { // col 3
                end = true;
            } else if (matrix[4] === this.seed && matrix[6] === this.seed) {  // dialog 2
                end = true;
            }
        }
        if (matrix[3] === this.seed) {
            if (matrix[4] === this.seed && matrix[5] === this.seed) { // row 2
                end = true;
            }
        }
        if (matrix[6] === this.seed) {
            if (matrix[7] === this.seed && matrix[8] === this.seed) { // row 3
                end = true;
            }
        }
        return end;
    }


    rematch() {
        this.socketService.send(this.socket, this.nameRoom, {
            matrix: '',
            userCurrentTurn: this.userCurrentTurn,
            winner: '',
            rematch: 'enable'
        });
    }


}
