import { Component, OnInit } from '@angular/core';
import { UomSharedService } from '../../service/uom-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { UomService } from '../../service/uom.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  host: { 'class': 'general-card' }
})
export class GeneralComponent implements OnInit {
  disabled: any = {};
  constructor(public _shared: UomSharedService,
    private _inputService: TnzInputService,
    public service: UomService) { }

  ngOnInit(): void {

  }
  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }
  validateData(event,  attr) {
    const attrValue = event.value.trim();
    const upperValue = attrValue.toUpperCase();
    if (attr == 'machineCode' && attrValue.length > 0) {
        this.service.duplicateCategoryCodeCheck(upperValue).then(data => {
            if (data) {
                this._inputService.setError(event.path, 'Duplicate machine code -' + upperValue + ' !');
            }
        }).catch(err => {
        });
    }
  }
}
