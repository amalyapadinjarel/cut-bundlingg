import { Component, OnInit } from '@angular/core';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';

@Component({
  selector: 'concurrent-programs-header',
  templateUrl: './header.component.html',
  host: { 'class': 'form-header' }
})
export class HeaderComponent implements OnInit {

  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService) { }

  ngOnInit(): void {
  }

}
