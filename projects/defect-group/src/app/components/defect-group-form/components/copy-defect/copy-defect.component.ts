import { OnInit, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { defectGroupLovconfig } from '../general-details/general-details.component';
import { DefectGroupSharedService } from '../../../../services/defect-group-shared.service';


@Component({
    selector: 'app-copy-defect',
    templateUrl: './copy-defect.component.html',
    styleUrls: ['./copy-defect.component.scss']
})
export class CopyDefectComponent implements OnInit {
    loading = false;
    defGrpId;
    constructor(
        private dialogRef: MatDialogRef<CopyDefectComponent> , public _shared: DefectGroupSharedService 
    ) { }

    ngOnInit(): void { }

    valueChangedFromUI(event) {
        if (event && event.value && event.value.value) {
            this.defGrpId = event.value.value
        } else {
            this.defGrpId = null
        }
    }

    defectGrpLov() {
        return JSON.parse(JSON.stringify(defectGroupLovconfig(this._shared.id ? this._shared.id : 0)));
      }

    close(flag) {
        this.dialogRef.close(flag ? this.defGrpId : null)
    }
}