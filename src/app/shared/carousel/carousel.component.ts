import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Output() avatarSelected: EventEmitter<string>;

  // for gesture
  start = {
    t: null,
    x: null,
    y: null
  };
  end = {
    x: null,
    y: null
  };
  tracking = false;
  thresholdTime = 500;
  thresholdDistance = 100;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.avatarSelected = new EventEmitter();
  }

  ngOnInit() {
    // init avatar
    this.avatarSelected.emit(this.elRef.nativeElement.querySelector('.selected').childNodes[1].alt);

    // TODO implementare click su altri avatar e selezione in automatico
    // $('#carousel div').click(function() {
    //   moveToSelected($(this));
    // });

    // Swipe with PointerEvents
    // https://developers.google.com/web/fundamentals/design-and-ux/input/touch/
    const o = this.elRef.nativeElement.querySelector('#carousel');

    this.renderer.listen(o, 'pointerdown', (event) => {
      this.gestureStart(o, event);
    });
    this.renderer.listen(o, 'pointermove', (event) => {
      this.gestureMove(o, event);
    });
    this.renderer.listen(o, 'pointerup', (event) => {
      this.gestureEnd(o, event);
    });
    this.renderer.listen(o, 'pointerleave', (event) => {
      this.gestureEnd(o, event);
    });
    this.renderer.listen(o, 'pointercancel', (event) => {
      this.gestureEnd(o, event);
    });

  }

  gestureStart (o, e) {
    // o.innerHTML = '';
    this.tracking = true;
    /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
    this.start.t = new Date().getTime();
    this.start.x = e.clientX;
    this.start.y = e.clientY;
  }
  gestureMove(o, e) {
    if (this.tracking) {
      e.preventDefault();
      this.end.x = e.clientX;
      this.end.y = e.clientY;
    }
  }
  gestureEnd (o, e) {
    if (this.tracking) {
      this.tracking = false;
      const now = new Date().getTime();
      const deltaTime = now - this.start.t;
      const deltaX = this.end.x - this.start.x;
      const deltaY = this.end.y - this.start.y;
      /* work out what the movement was */
      if (deltaTime > this.thresholdTime) {
        /* gesture too slow */
        return;
      } else {
        if ((deltaX > this.thresholdDistance) && (Math.abs(deltaY) < this.thresholdDistance)) {
          // o.innerHTML = 'swipe right';
          this.moveToSelected('prev');
        } else if ((-deltaX > this.thresholdDistance) && (Math.abs(deltaY) < this.thresholdDistance)) {
          // o.innerHTML = 'swipe left';
          this.moveToSelected('next');
        } else if ((deltaY > this.thresholdDistance) && (Math.abs(deltaX) < this.thresholdDistance)) {
          // o.innerHTML = 'swipe down';
        } else if ((-deltaY > this.thresholdDistance) && (Math.abs(deltaX) < this.thresholdDistance)) {
          // o.innerHTML = 'swipe up';
        } else {
          // o.innerHTML = '';
        }
      }
    }
  }

  moveToSelected(element) {
    if (element === 'next') {
      const prev = this.elRef.nativeElement.querySelector('.selected');
      if (prev.nextElementSibling) {  // if null, carousel is at the end of images(RX)
        const curr = prev.nextElementSibling;
        this.avatarSelected.emit(curr.childNodes[1].alt);
        const next = curr.nextElementSibling;
        let prevSecond = null;
        let nextSecond = null;
        let nextThird = null;
        let prevThird = null;
        if (next) {
          nextSecond = next.nextElementSibling;
        }
        if (nextSecond) {
          nextThird = nextSecond.nextElementSibling;
        }
        if (prev) {
          prevSecond = prev.previousElementSibling;
        }
        if (prevSecond) {
          prevThird = prevSecond.previousElementSibling;
        }
        this.renderer.removeClass(prev, 'selected');
        this.renderer.addClass(prev, 'prev');
        this.renderer.removeClass(curr, 'next');
        this.renderer.addClass(curr, 'selected');
        if (prevSecond) {
          this.renderer.removeClass(prevSecond, 'prev');
          this.renderer.addClass(prevSecond, 'prevLeftSecond');
        }
        if (prevThird) {
          this.renderer.removeClass(prevThird, 'prevLeftSecond');
          this.renderer.addClass(prevThird, 'hideLeft');
        }
        if (next) {
          this.renderer.removeClass(next, 'nextRightSecond');
          this.renderer.addClass(next, 'next');
        }
        if (nextSecond) {
          this.renderer.removeClass(nextSecond, 'hideRight');
          this.renderer.addClass(nextSecond, 'nextRightSecond');
        }
      }
    } else if (element === 'prev') {
      // selected = this.elRef.nativeElement.querySelector('.prev');
      const next = this.elRef.nativeElement.querySelector('.selected');
      if (next.previousElementSibling) {  // if null, carousel is at the end of images(SX)
        const curr = next.previousElementSibling;
        this.avatarSelected.emit(curr.childNodes[1].alt);
        const prev = curr.previousElementSibling;
        let prevSecond = null;
        let nextSecond = null;
        let nextThird = null;
        let prevThird = null;
        if (next) {
          nextSecond = next.nextElementSibling;
        }
        if (nextSecond) {
          nextThird = nextSecond.nextElementSibling;
        }
        if (prev) {
          prevSecond = prev.previousElementSibling;
        }
        if (prevSecond) {
          prevThird = prevSecond.previousElementSibling;
        }
        this.renderer.removeClass(next, 'selected');
        this.renderer.addClass(next, 'next');
        this.renderer.removeClass(curr, 'prev');
        this.renderer.addClass(curr, 'selected');
        if (nextSecond) {
          this.renderer.removeClass(nextSecond, 'next');
          this.renderer.addClass(nextSecond, 'nextRightSecond');
        }
        if (nextThird) {
          this.renderer.removeClass(nextThird, 'nextRightSecond');
          this.renderer.addClass(nextThird, 'hideRight');
        }
        if (prev) {
          this.renderer.removeClass(prev, 'prevLeftSecond');
          this.renderer.addClass(prev, 'prev');
        }
        if (prevSecond) {
          this.renderer.removeClass(prevSecond, 'hideLeft');
          this.renderer.addClass(prevSecond, 'prevLeftSecond');
        }
      }
    } else {
      // TODO implementare click su altri avatar e selezione in automatico
      // selected = element;
      // selected = this.renderer.selectRootElement('.selected');
    }

  }

}
