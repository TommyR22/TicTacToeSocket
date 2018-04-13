import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SharedService {

    roomName: string;

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

    emitChangeStep(step: number) {
        this.emitChangeSource.next(step);
    }

    emitChangeLoader(loaderState: boolean) {
        this.emitChangeSourceLoader.next(loaderState);
    }

    emitChangeMatrix(matrix: any) {
        this.emitChangeSourceMatrix.next(matrix);
    }

    setRoomName(roomName: string) {
        this.roomName = roomName;
    }

    getRoomName() {
        return this.roomName;
    }
}
