import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class NotifyComponent implements OnInit, OnChanges {

  @Input() type?: string;
  @Input() title: string;
  @Input() text: string;
  @Input() showNotify: boolean;
  @Output() eventCloseNotify: EventEmitter<boolean> = new EventEmitter<boolean>();

  private iconColor: string;
  private iconText: string;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    switch (this.type) {
      case 'error': {
        this.iconColor = 'darkred';
        this.iconText = 'fa-exclamation-triangle';
        break;
      }
      case 'success': {
        this.iconColor = 'green';
        this.iconText = 'fa-check';
        setTimeout(() => {
          this.eventCloseNotify.emit(false);
        }, 2000);
        break;
      }
      default: {
        this.iconColor = 'blue';
        this.iconText = 'fa-info';
        break;
      }
    }
  }

  removeNotify() {
    this.eventCloseNotify.emit(false);
  }

}
