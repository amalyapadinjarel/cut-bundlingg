import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { ExecutableSharedService } from './executable-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExecutableModel } from '../models/executable.model';
import { resolve } from 'url';

@Injectable()
export class ExecutableService {

    public apiSubscribe: Subscription;
    constructor(private apiService: ApiService,
        private _shared: ExecutableSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router
    ) { }


    save(exit): Promise<any> {
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appPath);
                    this._shared.listData = null;
                    this._shared.refreshExecutbleData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to save document. ' + err);
                    }
                    resolve(false);
                })
        });

    }

    saveData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let inValid;
            this._shared.lineKeys.forEach(key => {
                const inputs = this.inputService.getInput(this._shared[key + 'Path']);
                if (inputs) {
                    inValid = inputs.some(grp => {
                        if (grp) {
                            return Object.keys(grp).some(key => {
                                if (grp[key] && grp[key].status != 'ok' && grp[key].status != 'changed') {
                                    return true;
                                }
                            });
                        }
                    });
                }
            });
            if (inValid) {
                reject('Please fill mandatory fields.');
            } else {
                const saveData = this.inputService.getCache(this._shared.appPath)['executable'];
                if (saveData) {
                    let observable;
                    observable = this.apiService.post('/executable', saveData);
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data != '') {
                                reject(res && 'Duplicate executable code found .');
                            } else {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.exeId ? res.data.exeId : this._shared.id;
                                    resolve(res)
                                } else {
                                    reject(res && res.message ? res.message : 'Unknown error');
                                }
                            }
                        })
                } else {
                    reject('No changes detected');
                }
            }
        });
    }

    duplicateExeCodeCheck(upperValue) {
        return new Promise((resolve, reject) => {
            this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateExecutable/' + upperValue)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.duplicate == true) {
                        this.alertUtils.showAlerts('Duplicate executable code -' + upperValue + ' !');
                        resolve(true);
                    } else { resolve(false); }
                })
        })
    }

    setExportData() {
        let selectedLines = this._shared.selectedModelData;
        selectedLines.forEach(data => {
            this.createPrintData(data);
        })
    }

    setExportFormData() {
        let selectedLines;
        let observable = this.apiService.get('/' + this._shared.apiBase);
        observable.subscribe(retData => {
            selectedLines = retData;
            selectedLines.executable.forEach(data => {
                this.createPrintData(data);
            })
            this.writeExeData(this._shared.selectDataforPrint, 'false');
        });
    }

    createPrintData(data) {
        const exeData = {
            'shortCode': data['shortCode'],
            'applicationName': data['application'],
            'exeName': data['exeName'],
            'description': data['description'],
            'exeFile': data['exeFile'],
            'exeMethodName': data['exeMethod'],
            'active': data['active']
        }
        this._shared.selectDataforPrint.push(JSON.parse(JSON.stringify(exeData)));
        this._shared.exePrintId = data['exeId'];
    }

    writeExeData(data, flag) {
        const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
        let anchor = document.createElement('a');
        if (flag) {
            anchor.download = "TRENDZ-executables-export-" + this._shared.exePrintId + ".tnzdat";
        }
        else {
            anchor.download = "TRENDZ-executables-export.tnzdat";
        }
        anchor.href = ((window as any).webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
        this._shared.selectDataforPrint = [];
    }

    readExeData(data) {
        let duplicateFlag = false;
        let observable;
        let invalidCode: any = [];
        this._shared.initLocalCache();
        data.forEach(element => {
            observable = this.apiService.get('/' + this._shared.apiBase + '/duplicateExecutable/' + element['shortCode'])
            observable.subscribe(async retData => {
                duplicateFlag = retData.duplicate;
                if (!duplicateFlag) {
                    const exeMethodValue = await this.setLovData(element['exeMethodName'], '1');
                    element['exeMethodName'] = exeMethodValue;
                    const applicationNameValue = await this.setLovData(element['applicationName'], '2');
                    element['applicationName'] = applicationNameValue;
                   
                    this._shared.editMode = true;
                    this._shared.addLine('executable', new ExecutableModel(element));

                }
                else {
                    invalidCode.push(element.shortCode);
                    this.alertUtils.showAlerts('Duplicate executable code -' + invalidCode + ' !');
                }
            })
        });


    }

    setLovData(element, val): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let observableValue;
            let value;
            if (val == '1') {
                observableValue = this.apiService.get('/lovs/lookup?lookupType=EXECUTION_METHOD')
                observableValue.subscribe(retData => {
                    value = retData.data.find(item => item.value === element);

                    resolve(value);
                });

            }

            if (val == '2') {
                observableValue = this.apiService.get('/lovs/application')
                observableValue.subscribe(retData => {
                    value = retData.data.find(item => item.shortCode === element)
                    resolve(value);
                })
            }
        })

    }

}