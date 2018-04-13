import {Injectable} from '@angular/core';
import {User} from './models/user.model';

@Injectable()
export class SocketService {

  socket: any;
  room: string;

  rooms = [];

  constructor() {
  }

  setSocket(socket: any) {
    this.socket = socket;
  }

  getSocket() {
    return this.socket;
  }

  setRoom(roomName: string) {
    this.room = roomName;
  }

  getRoom() {
    return this.room;
  }

  newPlayer(socket: any, user: User) {
    socket.emit('player.new', {user: user});
  }

  newRoom(socket: any, nameRoom: string, user: User) {
    const now = new Date();
    socket.emit('room.new',
      {room: {name: nameRoom, description: 'Prova descrizione', timestamp: now, user: user}});
  }

  updateRooms(socket: any) {
    socket.emit('rooms.update');
  }

  updateClients(socket: any, nameRoom: string) {
    socket.emit('clients.update', {room: nameRoom});
  }

  joinRoom(socket: any, nameRoom: string) {
    console.log('join', nameRoom);
    socket.emit('player.join', {room: nameRoom});
  }

  /**
   * client exit from Room
   * @param socket
   * @param {string} nameRoom
   */
  exitRoom(socket: any, nameRoom: string) {
    socket.emit('leave', {room: nameRoom});
  }

  startGame(socket: any, nameRoom: string) {
    socket.emit('game.start', {room: nameRoom});
  }

  send(socket: any, nameRoom: string, message: any) {
    socket.emit('send.message', {room: nameRoom, msg: message});
  }


}
