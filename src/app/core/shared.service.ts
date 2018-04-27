import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {User} from './models/user.model';

@Injectable()
export class SharedService {

    roomName: string;
    user: User;
    clients: any;

    constructor() {
    }
    // Observer for STEP
    private emitChangeSource = new Subject<any>();
    changeEmittedStep$ = this.emitChangeSource.asObservable();
    // Observer for LOADER
    private emitChangeSourceLoader = new Subject<any>();
    changeEmittedLoader$ = this.emitChangeSourceLoader.asObservable();
    // Observer for MATRIX
    private emitChangeSourceMatrix = new Subject<any>();
    changeEmittedMatrix$ = this.emitChangeSourceMatrix.asObservable();
    // Observer for RESET
    private emitChangeSourceReset = new Subject<any>();
    changeEmittedReset$ = this.emitChangeSourceReset.asObservable();
    // Observer for CLIENTS
    private emitChangeSourceClients = new Subject<any>();
    changeEmittedClients$ = this.emitChangeSourceClients.asObservable();

    emitChangeStep(step: number) {
        this.emitChangeSource.next(step);
    }

    emitChangeLoader(loaderState: boolean) {
        this.emitChangeSourceLoader.next(loaderState);
    }

    emitChangeMatrix(matrix: any) {
        this.emitChangeSourceMatrix.next(matrix);
    }

    emitChangeReset() {
        this.emitChangeSourceReset.next();
    }

    emitChangeClients(clients: any) {
        this.emitChangeSourceClients.next(clients);
    }

    setRoomName(roomName: string) {
        this.roomName = roomName;
    }

    getRoomName() {
        return this.roomName;
    }

    setUser(user: User) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    setClients(clients: any) {
        this.clients = clients;
    }

    getClients() {
        return this.clients;
    }
}
