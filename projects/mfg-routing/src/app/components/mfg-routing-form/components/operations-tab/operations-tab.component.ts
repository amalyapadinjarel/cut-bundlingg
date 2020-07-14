import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SmdDataTable} from '../../../../../../../../src/app/shared/component/smd/smd-datatable';
import {MfgRoutingSharedService} from '../../../../services/mfg-routing-shared.service';
import {MfgRoutingService} from '../../../../services/mfg-routing.service';
import {SubSink} from 'subsink';
import {AlertUtilities} from '../../../../../../../../src/app/shared/utils';
import {TnzInputService} from '../../../../../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NewOperationGroupComponent} from '../new-operation-group/new-operation-group.component';
import {UploadFileComponent} from '../../../../../../../../src/app/shared/component';
import {DocumentService} from '../../../../../../../../src/app/shared/services';


@Component({
    selector: 'operations-tab',
    templateUrl: './operations-tab.component.html',
    styleUrls: ['./operations-tab.component.scss']
})
export class OperationsTabComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    @ViewChild(SmdDataTable) dataTable: SmdDataTable;
    public key = 'operationDetails';
    operationsLov = JSON.parse(JSON.stringify(operationsLovconfig));
    operationGroup = JSON.parse(JSON.stringify(operationsGroupLovconfig));
    private matDialogRef: MatDialogRef<UploadFileComponent, any>;
    @ViewChild('upload') postUploadTemplate: TemplateRef<any>


    constructor(public _shared: MfgRoutingSharedService, private _service: MfgRoutingService, private alertUtils: AlertUtilities,
                public inputService: TnzInputService,
                private dialog: MatDialog,
                public  docService: DocumentService) {
    }

    ngOnInit(): void {
        this.subs.sink = this._shared.refreshData.subscribe(change => {
            this._service.loadData(this.key);
        });
        this.subs.sink = this._shared.refreshOpertionTable.subscribe(change => {

            if (change) {
                this.refreshTable();

            }
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }


    refreshTable() {
        setTimeout(_ => this.dataTable.refresh(this._shared.formData[this.key]), 0)
    }

    valueChangedFromUI(event) {
        if (event.displayValue == 'ADD NEW') {
            const dialogRef = this.dialog.open(NewOperationGroupComponent);
            this.subs.sink = dialogRef.afterClosed().subscribe(res => {
                if (res) {
                    let newOpertionGroup = {
                        value: res.opId,
                        label: res.opName
                    }
                    this.inputService.updateInput(event.path, newOpertionGroup);
                } else {
                    this.inputService.updateInput(event.path, '');
                }
            })
        } else {
            let flag = false;
            let foundOne = false;
            let path = event.path;
            let SelectedSemiProdId = event.value.semiProdId;
            // let cache = this._service.getSavedCacheData();
            // cache[this.key].forEach((value, index) => {
            //     if (value == null) {
            //         let dataFromForm = this._shared.formData[this.key];
            //         if (dataFromForm[index].semiProdId == SelectedSemiProdId) {
            //             if (foundOne) {
            //                 flag = true;
            //             } else {
            //                 foundOne = true;
            //             }
            //         }
            //     } else {
            //         if (value.panelName && value.panelName.semiProdId == SelectedSemiProdId) {
            //             if (foundOne) {
            //                 flag = true;
            //             } else {
            //                 foundOne = true;
            //             }
            //         }
            //     }
            // });
            if (flag) {
                this.alertUtils.showAlerts('Selected cut panel already exist.');
                this.inputService.setError(path, 'Selected cut panel already exist.')
            }

        }

    }

    deleteLine(index, activeInOut: boolean) {
        if (!activeInOut) {
            this._shared.deleteLine(this.key, index)
        } else {
            this.alertUtils.showAlerts('Cannot delete active in IN_OUT ')
        }
    }

    get isApproved() {
        return this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED';
    }

    uploadRoutingLines() {
        if (this.isApproved) {
            this.alertUtils.showAlerts('Cannot upload operations in ' + this._shared.getHeaderAttributeValue('docStatusName') + ' status.')
        } else {
            this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
                .then(() => {
                    this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docTypeId'))
                        .then(data => {
                            this.matDialogRef = this.dialog.open(UploadFileComponent);
                            this.matDialogRef.componentInstance.customtemplate = this.postUploadTemplate;
                            this.matDialogRef.componentInstance.templateUrl = 'assets/data/Routing-Steps-Upload-Template.xlsx'

                        })
                        .catch(err => {

                            this.alertUtils.showAlerts(err)
                        })
                })
                .catch(err => {
                    this.alertUtils.showAlerts(err)
                })


            // this.matDialogRef.afterClosed().subscribe(value => console.log(value))
        }
    }

    postUploadAction() {
        let fileName: string = this.matDialogRef.componentInstance.result.data;
        const allowedExtensions = ['xlsx', 'xls'];
        let extensionname = fileName.substr(fileName.lastIndexOf('.') + 1);
        if (allowedExtensions.includes(extensionname)) {
            this.matDialogRef.componentInstance.loading = true;
            this.subs.sink = this._service.processUploadedRoutingSteps(fileName).subscribe(
                result => {
                    if (result) {
                        this.matDialogRef.componentInstance.loading = false;

                        if (result.success && result.data.returnCode == 1) {
                            this._shared.refreshData.next(true)
                            this.matDialogRef.close();
                        } else {
                            this.matDialogRef.componentInstance.showCustomTemplate = false;
                            this.matDialogRef.close();

                        }
                        this.alertUtils.showAlerts(result.data ? result.data.message : result.message)

                    }
                }
            );
        } else {
            this.alertUtils.showAlerts('Please upload xlsx or xls file.')
            this.matDialogRef.close();

        }

    }

    valueChangedInNextOpSequence($event
                                     :
                                     any
    ) {
    }

    deleteLines(key
                    :
                    string
    ) {
        this._service.deleteLines(key);
    }

    onRowSelected() {
        this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
    }
}


export const operationsLovconfig: any = {
    title: 'Select operation',
    url: 'lovs/operation',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
        {
            key: 'label',
            title: 'Operation'
        },
        {
            key: 'shortCode',
            title: 'Operation Code'
        },]
};

export const operationsGroupLovconfig: any = {
    title: 'Select Operation Group',
    url: 'lovs/operation?operationOrGroup=operationGroup',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
        {
            key: 'label',
            title: 'Operation'
        },
        {
            key: 'shortCode',
            title: 'Operation Code'
        },
    ]
};
