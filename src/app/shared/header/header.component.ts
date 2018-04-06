import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {SharedService} from '../../core/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() update: EventEmitter<string>;
  @Output() exit: EventEmitter<string>;

  step = 1;

  constructor(private elRef: ElementRef, private renderer: Renderer2, private sharedService: SharedService) {
    this.update = new EventEmitter();
    this.exit = new EventEmitter();
  }

  ngOnInit() {
    this.sharedService.changeEmittedStep$.subscribe(
      step => {
        console.log('[HeaderComponent] STEP', step);
        this.step = step;
      });
  }

  updateRooms() {
    const icon_update = this.elRef.nativeElement.querySelector('#icon_update');
    this.renderer.addClass(icon_update, 'fa-spin');
    setTimeout(() => {
      const icon_update2 = this.elRef.nativeElement.querySelector('#icon_update');
      this.renderer.removeClass(icon_update2, 'fa-spin');
    }, 1000);
    this.update.emit();
  }

  exitRoom() {
    this.exit.emit();
  }

}
