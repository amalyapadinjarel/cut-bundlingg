import { OnInit, Component, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { DefectGroupSharedService } from '../../services/defect-group-shared.service';
import { Router } from '@angular/router';
import { DefectGroupService } from '../../services/defect-group.service';

@Component({
    selector: 'defect-group-list',
    templateUrl: './defect-group-list.component.html'
})
export class ListComponent implements OnInit {

    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

    private refreshListData: Subscription;
    constructor(
        public _shared: DefectGroupSharedService,
        private router: Router,
        public _service: DefectGroupService) { }

    ngOnInit() {
        this.refreshListData = this._shared.refreshdefectGroupHeaderData.subscribe(
            change => {
                this.dataTable.refresh(this._shared.formData['defectGroup'])
            }
        );

        this.dataTable.refresh([])
        setTimeout(_ => {
            this.dataTable.refresh();
        }, 0);
        this._shared.id = 0;

    }

    rowSelected(event) {
        this._shared.id = event.model.defGroupId;
        if (event.selected) {
            this.router.navigateByUrl('/defect-group/' + event.model.defGroupId);
        }
    }
    _onDataChange(dataChange: any) {

        if (dataChange.data && dataChange.data.defectGroup) {
            this._shared.setFormData(dataChange.data);
            this._shared.params = this.dataTable.getParams();
        }
    }
}