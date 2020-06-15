import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {MfgRoutingSharedService} from './services/mfg-routing-shared.service';
import {DocumentService} from '../../../../src/app/shared/services';
import {Router} from '@angular/router';
import {AlertUtilities} from '../../../../src/app/shared/utils';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmPopupComponent, UploadFileComponent} from '../../../../src/app/shared/component';
import {Location} from '@angular/common';
import {MfgRoutingService} from './services/mfg-routing.service';
import {SubSink} from 'subsink';

@Component({
    templateUrl: './mfg-routing.component.html'
})
export class MfgRoutingComponent implements OnDestroy {

    subs = new SubSink();
    @ViewChild('upload') postUploadTemplate: TemplateRef<any>
    private matDialogRef: MatDialogRef<UploadFileComponent, any>;

    constructor(public _shared: MfgRoutingSharedService,
                public  docService: DocumentService,
                public router: Router,
                private alertutils: AlertUtilities,
                private matDialog: MatDialog,
                private location: Location,
                private _service: MfgRoutingService,
                private dialog: MatDialog
    ) {
    }

    cancelEdit() {
        if (this._shared.id > 0) {
            this.location.go('/routing/' + this._shared.id);
            this._shared.editMode = false;
            this._shared.reviseMode = false;
            this._shared.initLocalCache();
            this._shared.resetLines();
        } else {
            this.router.navigateByUrl('/routing/list').then(done => {
                this._shared.editMode = false;
                this._shared.reviseMode = false;
                this._shared.initLocalCache();
            });
        }
    }

    save(exit = false) {
        this._service.save().then((flag) => {
            if (flag && exit) {
                this.cancelEdit();
            }
        })
    }

    createNewRouting() {
        this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
            .then(value => {
                this.router.navigateByUrl('/routing/create').then(done => {
                    this._shared.editMode = true;
                    this._shared.initLocalCache();
                }).catch(reason => console.log(reason))
            }).catch(err => {
            this.alertutils.showAlerts(err)
        })
    }

    uploadRouting() {
        this.matDialogRef = this.matDialog.open(UploadFileComponent);
        this.matDialogRef.componentInstance.customtemplate = this.postUploadTemplate;
        this.matDialogRef.componentInstance.templateUrl = 'assets/data/Routing-Upload-Template.xlsx'

    }

    editRouting() {
        if (this.isApproved) {
            this.alertutils.showAlerts('Cannot edit document in ' + this._shared.getHeaderAttributeValue('docStatusName') + ' status.')
        } else {

            this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
                .then(() => {
                    this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docTypeId'))
                        .then(data => {
                            this.location.go('routing/' + this._shared.id + '/edit')
                            this._shared.editMode = true;
                            this._shared.initLocalCache()

                        })
                        .catch(err => {

                            this.alertutils.showAlerts(err)
                        })
                })
                .catch(err => {
                    this.alertutils.showAlerts(err)
                })
        }

    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    approve() {
        if (this.isApproved) {
            this.alertutils.showAlerts('Cannot approve document in ' + this._shared.getHeaderAttributeValue('docStatusName') + ' status.')
        } else {
            this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
                .then(() => {
                    this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docTypeId'))
                        .then(data => {
                            this._service.approve().then((data: string) => {
                                this.alertutils.showAlerts(data)
                                this._shared.refreshData.next(true);
                            })
                                .catch(err => {
                                    this.alertutils.showAlerts(err);
                                    this._shared.refreshData.next(true);
                                })
                        })
                        .catch(err => {
                            this.alertutils.showAlerts(err)
                        })
                })
                .catch(err => {
                    this.alertutils.showAlerts(err)
                })

        }
    }

    get isApproved() {
        return this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED';
    }


    postUploadAction() {
        const fileName: string = this.matDialogRef.componentInstance.result.data;
        const allowedExtensions = ['xlsx', 'xls'];
        let extensionname = fileName.substr(fileName.lastIndexOf('.') + 1);
        if (allowedExtensions.includes(extensionname)) {
            this.subs.sink = this._service.processUploadedRouting(fileName).subscribe(
                result => {
                    if (result) {
                        if (result.success && result.data.returnCode == 1) {
                            this.matDialogRef.close();
                        } else {
                            this.matDialogRef.componentInstance.showCustomTemplate = false;
                        }
                        this.alertutils.showAlerts(result.data?.message || result.message)

                    }
                }
            );
        } else {
            this.alertutils.showAlerts('Please upload xlsx or xls file.')
            this.matDialogRef.close();

        }
    }

    copyRouting() {
        const dialogRef = this.dialog.open(ConfirmPopupComponent);
        dialogRef.componentInstance.confirmText = 'CONFIRM';
        dialogRef.componentInstance.dialogTitle = 'Copy Routing';
        dialogRef.componentInstance.message = 'Are you sure you want to copy the current routing ? '
        this.subs.sink = dialogRef.afterClosed().subscribe(flag => {
            if (flag) {
                this._service.copyRouting().then((data: any) => {
                    if (data.additionalData && data.additionalData.targetId) {
                        this.router.navigateByUrl('/routing/' + data.additionalData.targetId)
                    }
                }).catch(err => {
                    this.alertutils.showAlerts(err)
                })
            }
        })
    }

    revise() {
        if (!this.isApproved) {
            this.alertutils.showAlerts('Cannot revise document in ' + this._shared.getHeaderAttributeValue('docStatusName') + ' status.')
        } else {
            this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
                .then(() => {
                    this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docTypeId'))
                        .then(data => {
                            // this.location.go('routing/' + this._shared.id + '/edit')
                            // this._shared.editMode = true;
                            // this._shared.reviseMode = true;
                            // this._shared.initLocalCache()
                            this.subs.sink = this._service.reviseDocument().subscribe(response => {
                                if (response.success) {
                                    this._shared.refreshData.next(true);
                                }
                            });

                        })
                        .catch(err => {
                            this.alertutils.showAlerts(err)
                        })
                })
                .catch(err => {
                    this.alertutils.showAlerts(err)
                })

        }
    }
}
