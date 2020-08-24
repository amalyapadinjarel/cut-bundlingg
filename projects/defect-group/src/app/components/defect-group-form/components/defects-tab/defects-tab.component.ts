import { OnInit, OnDestroy, ViewChild, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { DefectGroupSharedService } from '../../../../services/defect-group-shared.service';
import { DefectGroupService } from '../../../../services/defect-group.service';
import { ApiService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { CopyDefectComponent } from '../copy-defect/copy-defect.component';
import { SubSink } from 'subsink';
import { DefectsModel } from '../../../../model/defect-group.model';


@Component({
    selector: 'defects-tab',
    templateUrl: './defects-tab.component.html',
    styleUrls: ['./defects-tab.component.scss'],
})
export class defectLineComponent implements OnInit, OnDestroy {
    private refreshSub: Subscription;
    private refreshLine: Subscription;
    subs = new SubSink();
    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
    public key = 'defect';
    constructor(public _shared: DefectGroupSharedService, private _service: DefectGroupService,
        public apiService: ApiService, public _inputService: TnzInputService, private dialog: MatDialog) {
    }

    ngOnInit(): void {

        this.refreshSub = this._shared.refreshdefectGroupHeaderData.subscribe(change => {
            this._service.loadData(this.key);
        });
        this.refreshLine = this._shared.refreshDefectData.subscribe(change => {
            this.refreshTable();
        });
    }

    ngOnDestroy(): void {
        this.refreshSub.unsubscribe();
        this.refreshLine.unsubscribe();
        this.subs.unsubscribe();
    }

    refreshTable() {
        this.dataTable.refresh(this._shared.formData.defect);
    }

    getIfEditable(key, index) {
        let val = this._inputService.getInputValue(this._shared.getdefectDetailsPath(index, 'defectId'));
        return this._shared.getDefectGrpEditable(key, val);
    }

    validateData(event, index, attr) {
        const attrValue = event.value.trim();
        if (attrValue.length > 60) {
            this._inputService.setError(this._shared.getdefectDetailsPath(index, attr), 'Length exceeded 60 characters!');
        }
        if ((attrValue && attrValue.length <= 0) || attrValue == '' || attrValue == null) {
            this._inputService.setError(this._shared.getdefectDetailsPath(index, attr), 'Field cannot be left blank!');
        }
    }

    copy() {
        const dialogRef = this.dialog.open(CopyDefectComponent);
        this.subs.sink = dialogRef.afterClosed().subscribe(defGrpId => {
            if (defGrpId) {
                this._service.fetchDefectsforCopy(defGrpId).then((data: any) => {
                    const form = JSON.parse(JSON.stringify(data));
                    this._shared.editMode = true;
                    form.forEach((row, idx) => {
                        Object.keys(row).forEach((key) => {
                            if (key == this._shared.defectPrimaryKey) {
                                row[key] = 0;
                            }
                            if (key === 'defGroupId') {
                                row[key] = this._shared.id;
                            }
                        })
                        this._shared.addLine('true', 'defect', new DefectsModel(row));
                    })

                }).catch(err => {

                })
            }
        })
    }
    omit_other_char(event) {
        var k;
        k = event.charCode;
        return (k >= 48 && k <= 57);
    }
}