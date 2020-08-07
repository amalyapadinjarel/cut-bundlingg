import { Component, OnInit, ViewChild } from '@angular/core';
import { DocSequenceSharedService } from '../../_service/doc-sequence-shared.service';
import { DocSequenceService } from '../../_service/doc-sequence.service';
import { ActivatedRoute } from '@angular/router';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { SubSink } from 'subsink';
import { SmdDataTable } from 'app/shared/component';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';


@Component({
  selector: 'line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.scss']
})
export class LineDetailComponent implements OnInit {
  YearLov = JSON.parse(JSON.stringify(YearLovConfig));
  private subs = new SubSink();
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  constructor(public _shared: DocSequenceSharedService,
    private _service: DocSequenceService,
    private route: ActivatedRoute,
    private alertUtils: AlertUtilities,
    public dateUtils: DateUtilities,
    public inputService: TnzInputService) { }

  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
      this._service.loadData();

    });
    this.subs.sink = this._shared.refreshLinedetail.subscribe(change => {
      if (change) {
        this.refreshTable();

      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  refreshTable() {
    setTimeout(_ => this.dataTable.refresh(this._shared.formData['SeqLineDetail']), 0)
  }
  onRowSelected() {
    this._shared.setSelectedLines('SeqLineDetail', this.dataTable.selectedModels())
  }
  valueChangedFromUI(event) {
    let flag = false;
    let path = event.path;
    let dataFromForm = this._shared.formData['SeqLineDetail'];
    let cache = this._shared.getSavedCacheData('SeqLineDetail');
    let temCache = this._shared.getSavedCacheData('SeqLineDetail');


    cache.forEach((value, index) => {
      let cacheIndex = index

      if (value != null) {
        let year = value.year.label

        dataFromForm.forEach((value, index) => {
          if (value.year != null) {
            if (year == value.year) {
              flag = true;
            }
          }
        });
        temCache.forEach((value, index) => {
          if (value != null && cacheIndex != index) {
            if (year == value.year.label) { flag = true; }
          }
        });
      }

    });
    if (flag) {
      this.alertUtils.showAlerts('Selected Year already exist.');
      this.inputService.setError(path, 'Selected Year already exist.')
    }
  }
}
export var YearLovConfig: any = {
  title: 'Select Year',
  url: 'lovs/years',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
  filterAttributes: ['label'],

  displayFields: [{

    key: 'label',
    title: 'Year'
  }
  ]

};