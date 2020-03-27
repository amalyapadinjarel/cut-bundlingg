import { Component, Input } from '@angular/core';

@Component({
  selector: 'radial-progress-component',
  templateUrl: './component.html'
})
export class RadialProgressComponent {

  @Input() size = 24;
  @Input() barSize = 10;
  @Input() progress = 0;

  circleStyle = { width: "24px", height: "24px" };
  insetStyle = { width: "14px", height: "14px" };
  maskStyle = { clip: "rect(0px, 24px, 24px, 12px)" };
  maskFillStyle = { clip: "rect(0px, 12px, 24px, " + this.size  + "px)" };

  constructor() {
    this.circleStyle = { width: this.size + "px", height: this.size + "px" };
    this.insetStyle = { width: "calc(100% - " + this.barSize + "px)", height: "calc(100% - " + this.barSize + "px)" };
    this.maskStyle = { clip: "rect(0px, " + this.size + "px, " + this.size + "px, " + (this.size / 2) + "px)" };
    this.maskFillStyle = { clip: "rect(0px, " + (this.size / 2) + "px, " + this.size + "px, 0px)" };
  }

}
