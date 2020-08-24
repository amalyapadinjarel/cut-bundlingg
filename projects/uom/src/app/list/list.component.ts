import { Component, OnInit } from '@angular/core';
import { UomSharedService } from '../service/uom-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(public _shared: UomSharedService,
    public router: Router) { }

  ngOnInit(): void {
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.machines) {
        this._shared.formData = dataChange.data;
        this._shared.setFormData(dataChange.data);
        this._shared.setListData(dataChange.data);
    }
}

pageChanged(event) {
  this._shared.selectedPage = event.page;
}
rowSelected(event) {

   if (event.selected) {
     this._shared.initLocalCache();
     this.router.navigateByUrl('/uom/' + event.model.categoryId);

   }
 }
}
