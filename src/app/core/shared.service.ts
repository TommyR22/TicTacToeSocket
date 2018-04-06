import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SharedService {

  roomName: string;

  constructor() {
  }

  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmittedStep$ = this.emitChangeSource.asObservable();

  // Service message commands
  emitChangeStep(step: number) {
    this.emitChangeSource.next(step);
  }

  setRoomName(roomName: string) {
    this.roomName = roomName;
  }

  getRoomName() {
    return this.roomName;
  }
}
