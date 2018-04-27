import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {SharedService} from '../../core/shared.service';

@Component({
    selector: 'app-table-game',
    templateUrl: './table-game.component.html',
    styleUrls: ['./table-game.component.scss']
})
export class TableGameComponent implements OnInit {

    @Input() seed: number;
    @Input() isEnable: boolean;
    @Output() cubeSelected: EventEmitter<number>;

    cube1: any;
    cube2: any;
    cube3: any;
    cube4: any;
    cube5: any;
    cube6: any;
    cube7: any;
    cube8: any;
    cube9: any;

    constructor(private elRef: ElementRef,
                private renderer: Renderer2,
                private sharedService: SharedService) {
        this.cubeSelected = new EventEmitter();
    }

    ngOnInit() {
        this.cube1 = this.elRef.nativeElement.querySelector('#cube1');
        this.cube2 = this.elRef.nativeElement.querySelector('#cube2');
        this.cube3 = this.elRef.nativeElement.querySelector('#cube3');
        this.cube4 = this.elRef.nativeElement.querySelector('#cube4');
        this.cube5 = this.elRef.nativeElement.querySelector('#cube5');
        this.cube6 = this.elRef.nativeElement.querySelector('#cube6');
        this.cube7 = this.elRef.nativeElement.querySelector('#cube7');
        this.cube8 = this.elRef.nativeElement.querySelector('#cube8');
        this.cube9 = this.elRef.nativeElement.querySelector('#cube9');
        this.sharedService.changeEmittedReset$.subscribe(
            () => {
                this.reset();
            });
        this.sharedService.changeEmittedMatrix$.subscribe(
            matrix => {
                // console.log('Matrice ricevuta da table-game:', matrix);
                for (let _i = 0; _i < matrix.length; _i++) {
                    console.log('index:', _i);
                    switch (matrix[_i]) {
                        case 1: {
                            switch (_i) {
                                case 0: {
                                    this.renderer.addClass(this.cube1, `cube__disabled__x`);
                                    break;
                                }
                                case 1: {
                                    this.renderer.addClass(this.cube2, `cube__disabled__x`);
                                    break;
                                }
                                case 2: {
                                    this.renderer.addClass(this.cube3, `cube__disabled__x`);
                                    break;
                                }
                                case 3: {
                                    this.renderer.addClass(this.cube4, `cube__disabled__x`);
                                    break;
                                }
                                case 4: {
                                    this.renderer.addClass(this.cube5, `cube__disabled__x`);
                                    break;
                                }
                                case 5: {
                                    this.renderer.addClass(this.cube6, `cube__disabled__x`);
                                    break;
                                }
                                case 6: {
                                    this.renderer.addClass(this.cube7, `cube__disabled__x`);
                                    break;
                                }
                                case 7: {
                                    this.renderer.addClass(this.cube8, `cube__disabled__x`);
                                    break;
                                }
                                case 8: {
                                    this.renderer.addClass(this.cube9, `cube__disabled__x`);
                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (_i) {
                                case 0: {
                                    this.renderer.addClass(this.cube1, `cube__disabled__o`);
                                    break;
                                }
                                case 1: {
                                    this.renderer.addClass(this.cube2, `cube__disabled__o`);
                                    break;
                                }
                                case 2: {
                                    this.renderer.addClass(this.cube3, `cube__disabled__o`);
                                    break;
                                }
                                case 3: {
                                    this.renderer.addClass(this.cube4, `cube__disabled__o`);
                                    break;
                                }
                                case 4: {
                                    this.renderer.addClass(this.cube5, `cube__disabled__o`);
                                    break;
                                }
                                case 5: {
                                    this.renderer.addClass(this.cube6, `cube__disabled__o`);
                                    break;
                                }
                                case 6: {
                                    this.renderer.addClass(this.cube7, `cube__disabled__o`);
                                    break;
                                }
                                case 7: {
                                    this.renderer.addClass(this.cube8, `cube__disabled__o`);
                                    break;
                                }
                                case 8: {
                                    this.renderer.addClass(this.cube9, `cube__disabled__o`);
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            // nothing
                        }
                    }
                }
            });
    }

    clickCube(cube: number, seed: number) {
        console.log('Click cube:', cube, 'with seed:', seed, 'isEnable:', this.isEnable);
        if (this.isEnable) {
            let srcSeed: string;
            if (seed === 1) {
                srcSeed = 'x';
            } else {
                srcSeed = 'o';
            }
            switch (cube) {
                case 1: {
                    // this.renderer.removeClass(prevThird, 'prevLeftSecond');
                    this.renderer.addClass(this.cube1, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(0);
                    break;
                }
                case 2: {
                    this.renderer.addClass(this.cube2, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(1);
                    break;
                }
                case 3: {
                    this.renderer.addClass(this.cube3, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(2);
                    break;
                }
                case 4: {
                    this.renderer.addClass(this.cube4, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(3);
                    break;
                }
                case 5: {
                    this.renderer.addClass(this.cube5, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(4);
                    break;
                }
                case 6: {
                    this.renderer.addClass(this.cube6, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(5);
                    break;
                }
                case 7: {
                    this.renderer.addClass(this.cube7, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(6);
                    break;
                }
                case 8: {
                    this.renderer.addClass(this.cube8, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(7);
                    break;
                }
                case 9: {
                    this.renderer.addClass(this.cube9, `cube__disabled__${srcSeed}`);
                    this.cubeSelected.emit(8);
                    break;
                }
            }
        }
    }


    /**
     * Reset Game (Matrix)
     */
    reset() {
        console.log('Resetting game..');
        this.renderer.removeClass(this.cube1, `cube__disabled__x`);
        this.renderer.removeClass(this.cube1, `cube__disabled__o`);
        this.renderer.removeClass(this.cube2, `cube__disabled__x`);
        this.renderer.removeClass(this.cube2, `cube__disabled__o`);
        this.renderer.removeClass(this.cube3, `cube__disabled__x`);
        this.renderer.removeClass(this.cube3, `cube__disabled__o`);
        this.renderer.removeClass(this.cube4, `cube__disabled__x`);
        this.renderer.removeClass(this.cube4, `cube__disabled__o`);
        this.renderer.removeClass(this.cube5, `cube__disabled__x`);
        this.renderer.removeClass(this.cube5, `cube__disabled__o`);
        this.renderer.removeClass(this.cube6, `cube__disabled__x`);
        this.renderer.removeClass(this.cube6, `cube__disabled__o`);
        this.renderer.removeClass(this.cube7, `cube__disabled__x`);
        this.renderer.removeClass(this.cube7, `cube__disabled__o`);
        this.renderer.removeClass(this.cube8, `cube__disabled__x`);
        this.renderer.removeClass(this.cube8, `cube__disabled__o`);
        this.renderer.removeClass(this.cube9, `cube__disabled__x`);
        this.renderer.removeClass(this.cube9, `cube__disabled__o`);
    }

}
