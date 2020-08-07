import { Injectable } from '@angular/core';
import { DocSequenceSharedService } from './doc-sequence-shared.service';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { DocSeqHeaderModel } from '../models/doc-seq-model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { ConfirmPopupComponent } from 'app/shared/component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Injectable()
export class DocSequenceService {
    apiSubscription: Subscription;
  constructor( private apiService: ApiService,
    private _shared: DocSequenceSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
        private _dialog: MatDialog) { }
  
    fetchFormData(id?: number) {
      return new Promise((resolve, reject) => {
          if (this._shared.id != 0) {
              this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.id)
                  .subscribe(data => {
                      if (data.docSeq) {

                          resolve(new DocSeqHeaderModel(data.docSeq));
                      }
                      else {
                          reject();
                      }
                  }, err => reject(err));
          }
          else {
              resolve({});
          }
      }).catch((err) => {
          console.log('Caught Exception in Fetchformdata!');
      });
  }

  loadData() {
      let key='SeqLineDetail'
      this._shared[key + 'Loading'] = true;
    this._shared.setLines(key, []);
    if (this._shared.id == 0) {
        let data = this._shared.setLinesFromCache(key, []);

        this._shared.formData[key] = data;
        this._shared[key + 'Loading'] = false;
        this._shared.refreshLinedetail.next(true);
    } else {
        this.fetchLineDetail().then(
            (data: any) => {

                this._shared.setLines(key, data);
                data = this._shared.setLinesFromCache(key, data);
                this._shared.formData[key] = data;
                this._shared.refreshLinedetail.next(true);
                this._shared[key + 'Loading'] = false;
            },
            (err) => {
                this._shared.refreshLinedetail.next(true);
                this._shared[key + 'Loading'] = false;

            }
        );
    }
}
fetchLineDetail() {

    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {

            this.apiService.get('/' + this._shared.apiBase + '/sequence-lines?docSeqId=' + this._shared.id)
                .subscribe(data => {
                    if (data.data) {
                        resolve(data.data);

                    } else {
                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve([]);
        }
    });
}

  save(exit): Promise<any> {


    this._shared.loading = true;
    let isCreate = this._shared.id == 0;
    return new Promise((resolve, reject) => {
        this.saveData(this._shared.id)
            .then(res => {
                this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                this._shared.loading = false;
                if (isCreate) {
                    this._shared.onNewDocumentCreated();                   
                if(exit)
                {
                    this.router.navigateByUrl('/doc-sequence/' + this._shared.id);
                    this._shared.initLocalCache();       
                }
                else{
                    this.router.navigateByUrl('/doc-sequence/' + this._shared.id + '/edit')
                    this._shared.refreshData.next(true);
                }
                } else {
                    if (exit){
                        this.router.navigateByUrl('/doc-sequence/' + this._shared.id);
                        this._shared.initLocalCache();
                        this._shared.resetLines();
                    }
                    else
                        this._shared.refreshData.next(true);
                }
                resolve(true);
            }, err => {
                if (err) {
                    this.alertUtils.showAlerts('Failed to ' + 'edit' + ' document. ' + err);
                }
                this._shared.loading = false;
                resolve(false);
            })
    });

}
saveData(id): Promise<any> {
    return new Promise((resolve, reject) => {
        let inValid;

        // Checking if inputs are valid in header
        let inputs = this.inputService.getInput(this._shared.headerPath);
        if (inputs) {
            inValid = Object.keys(inputs).some(key => {
                if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
                    return true;
                }
            });
        }
        //Checking if inputs are valid in lines
        if (!inValid) {
            this._shared.lineKeys.forEach(key => {
                if (!inValid) {
                    inputs = this.inputService.getInput(this._shared[key + 'Path']);
     
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
                }
            });
        }
        if (inValid) {
            reject('Please fill mandatory fields.');
        } else {
            let saveData
            saveData = this._cache.getCachedValue(this._shared.appPath);
      if (saveData) {
        let errorData
        if (saveData.header) {
            if (saveData.header.shortCode) {
                saveData.header.shortCode = saveData.header.shortCode.toUpperCase();
                errorData = saveData.header.shortCode

            }
            if (saveData.header.useCustPgm) {
                if (saveData.header.useCustPgm == 'Y') {
                 
                    saveData.header['incrementBy'] = 0
                }
            }      
            if (saveData.header.resetYear) {
                if (saveData.header.resetYear == 'Y') {
                 
                    saveData.header['nextNum'] = ""
                }
                else{
                    saveData.header['autoReset'] = 0
                }
            }
        }
          
                      // Adding the removedkeys as active - N to remove them
                      this._shared.lineKeys.forEach(key => {
                        if (!saveData[key]) {
                            saveData[key] = [];
                        }
                        const removedPath = this._shared[key + 'RemovedKeysPath'];
                        const linePrimaryKey = this._shared[key + 'PrimaryKey']
                        const cache = this._cache.getCachedValue(removedPath)
                        if (cache && cache.length) {
                            cache.forEach(removedPrimaryKey => {
                                const json = { 'active': 'N' };
                                json[linePrimaryKey] = removedPrimaryKey;
                                saveData[key].push(json)
                            });
                        }
                    });
             

                //     if (saveData[key]) {

                //         let arr: any;
                //         arr = saveData[key];
                //         for (let index = 0; index < arr.length; index++) {
                //             let element = arr[index];

                //             if (element != null && element.isInitiate != null) {
                //                 element.isInitiate = element.isInitiate == 'Y' ? 1 : 0;

                //             }
                //         }
                //     }

                // });


                let observable;


                if (id == 0) {
            
                    observable = this.apiService.post('/doc-sequence', saveData)
                } else {
                    observable = this.apiService.put('/doc-sequence/' + id, saveData)
                }
                observable
                    .catch(err => {
                        reject(err);
                    })
                    .subscribe(res => {
                        if (res.data == null) {


                            reject(res && 'Duplicate short code found ' + errorData);
                        }
                        else {

                            if (res && res.success) {
                                this._shared.id = res.data && res.data.docSeqId ? res.data.docSeqId : this._shared.id;
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

deleteLines(key: string) {
    if (this._shared.selectedLines[key] && this._shared.selectedLines[key].length) {
        const primaryKey = this[key + 'PrimaryKey'];
        const dialogRef = this._dialog.open(ConfirmPopupComponent);
        dialogRef.componentInstance.dialogTitle = 'Delete selected record(s)';
        dialogRef.componentInstance.message = 'Are you sure you want to delete the selected ' + this._shared.selectedLines[key].length + ' record(s)'
        dialogRef.afterClosed().subscribe(flag => {
            if (flag) {
                this._shared.selectedLines[key].forEach(line => {
                    const index = this._shared.formData[key].findIndex(data => {
                        const model = this._shared.getLineModel(key, data)
                        let value = model.equals(line)
                        return value
                    });
                    this._shared.deleteLine(key, index);
                });
                this._shared.deleteLine(key, [])
            }
        })
    }
}

duplicateDocTypeCheck() {
    let shortCode = this._shared.formData.header.shortCode;
    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/checkDuplicate/' + shortCode)
            .catch(err => {
                reject(err);
                return err;
            })
            .subscribe(data => {
                if (data.DupDocType == true) {

                    this.alertUtils.showAlerts('Duplicate Short Code-' + shortCode + ' !');
                    resolve(true);

                } else {
                    resolve(false);
                }
            })
    }
    )
}

}
