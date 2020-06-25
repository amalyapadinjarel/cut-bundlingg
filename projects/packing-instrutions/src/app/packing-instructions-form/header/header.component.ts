import { Component, OnInit } from '@angular/core';
import { DateUtilities } from 'app/shared/utils';
import { PackingInstructionsSharedService } from '../../services/packing-instructions-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  host: { 'class': 'form-header' }
})
export class HeaderComponent implements OnInit {

  constructor(
		public dateUtils: DateUtilities,
		public _shared: PackingInstructionsSharedService,
		private _inputService: TnzInputService) { }

  ngOnInit(): void {
  }

}
