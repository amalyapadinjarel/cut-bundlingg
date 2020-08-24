import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'app/shared/services/api.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { LocalCacheService } from 'app/shared/services';
import { PdnProcessSharedService } from './pdn-process-shared.service';
import { Router } from '@angular/router';

@Injectable()
export class PdnProcessService {
  apiSubscribe: Subscription;

  constructor( 
    private apiService: ApiService,
    public inputService: TnzInputService,
    private _shared: PdnProcessSharedService,
    private alertUtils: AlertUtilities,
    private _cache: LocalCacheService,
    public router: Router) {}
    save(exit): Promise<any> {
      return new Promise((resolve, reject) => {
          this.saveData(this._shared.id)
              .then(res => {
                  this.inputService.resetInputCache(this._shared.appPath);
                  this._shared.listData = null;
                  this._shared.refreshData.next(true);
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
            const saveData = this.inputService.getCache(this._shared.appPath)['productionProcesses'];
            if (saveData) {
                let observable;
                observable = this.apiService.post('/production-processes', saveData);
                observable
                    .catch(err => {
                        reject(err);
                    })
                    .subscribe(res => {
                        if (res.data != null) {
                            if (res.data != "duplicateCode") {
                                reject(res && 'Duplicate sequence ' + res.data.split(",", 2)[0] + ' found.');
                                // reject(res && 'Duplicate sequence .');
                            } if (res.data == "duplicateCode") {
                                reject(res && 'Duplicate short code found .');
                            }
                        } else {
                            if (res && res.success) {
                                this._shared.id = res.data && res.data.processId ? res.data.processId : this._shared.id;
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
duplicatePPCodeCheck(upperValue) {
  return new Promise((resolve, reject) => {
      this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateProductionProcesses/' + upperValue)
          .catch(err => {
              reject(err);
              return err;
          })
          .subscribe(data => {
              if (data.duplicate == true) {
                  this.alertUtils.showAlerts('Duplicate code -' + upperValue + ' !');
                  resolve(true);
              } else { resolve(false); }
          })
  })
}
duplicatePPSeqCheck(seq, shortCode) {
  return new Promise((resolve, reject) => {
      this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateSeq/' + shortCode + '/' + seq)
          .catch(err => {
              reject(err);
              return err;
          })
          .subscribe(data => {
              if (data.duplicate == true) {
                  this.alertUtils.showAlerts('Duplicate sequence -' + seq + 'in facility ' + shortCode + ' !');
                  resolve(true);
              } else { resolve(false); }
          })
  })
}
}
