import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Location } from '@angular/common';
import { ConcurrentProgramSharedService } from './concurrent-program-shared.service';
import { HttpParams } from '@angular/common/http';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { CustomValidators } from 'app/shared/directives/validators';

@Injectable({
  providedIn: 'root'
})
export class ConcurrentProgramService {

  constructor(
    private apiService: ApiService,
    private _shared: ConcurrentProgramSharedService,
    public inputService: TnzInputService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public router: Router,
    private _dialog: MatDialog,
    private location: Location
  ) { }

  fetchFormData(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id > 0) {
        this.apiService
          .get("/" + this._shared.apiBase + "/" + this._shared.id)
          .subscribe(
            (data) => {
              if (data.concurrentProgram){
                resolve(data.concurrentProgram);
              } 
              else reject();
            },
            (err) => reject(err)
          );
      } else {
        resolve({});
      }
    });
  }

  loadData(key) {
    this._shared[key + "Loading"] = true;
    this._shared.setLines(key, []);
    if (this._shared.id == 0) {
      let data = this._shared.setLinesFromCache(key, []);
      this._shared.formData[key] = data;
      this._shared[key + "Loading"] = false;
      this._shared["refresh" + key].next(true);;
    } else {
      this.fetchLinesData(key).then(
        (data: any) => {
          this._shared.setLines(key, data);
          data = this._shared.setLinesFromCache(key, data);
          this._shared.formData[key] = data;
          this._shared["refresh" + key].next(true);
          this._shared[key + "Loading"] = false;
        },
        (err) => {
            this._shared["refresh" + key].next(true);;
          this._shared[key + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        }
      );
    }
  }

  fetchLinesData(key, id?) {
    switch (key) {
        case 'parametersDetails': return this.fetchParametersDetails(id);
        case 'templatesDetails' : return this.fetchTemplatesDetails(id);
        case 'styleSheetDetails': return this.fetchStyleSheetDetails(id);
        case 'rolesDetails'     : return this.fetchRolesDetails(id);
        default:
            break;
    }
}

fetchParametersDetails(id?: number) {
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
            this.apiService.get('/' + this._shared.apiBase + '/parameters/' + this._shared.id)
                .subscribe(data => {
                    if (data.parameters) {
                        if (data.displayOrder) {
                            this._shared.parametersDetailsSeqIncBy = Number(data.displayOrder.minDisplayOrder);
                            this._shared.parametersDetailsSeq = Number(data.displayOrder.maxDisplayOrder);
                        }
                        resolve(data.parameters);
                    }
                    else
                        reject();
                }, err => reject(err));
        }
        else {
            resolve([]);
        }
    });
}

fetchTemplatesDetails(id?: number) {
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
            this.apiService.get('/' + this._shared.apiBase + '/templates/' + this._shared.id)
                .subscribe(data => {
                    if (data.templates) {
                        resolve(data.templates);
                    }
                    else
                        reject();
                }, err => reject(err));
        }
        else {
            resolve([]);
        }
    });
}

fetchStyleSheetDetails(id?: number) {
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
            this.apiService.get('/' + this._shared.apiBase + '/style-sheet/' + this._shared.id)
                .subscribe(data => {
                    if (data.styleSheet) {
                        if (data.maxSequence) {
                            this._shared.styleSheetDetailsSeq = data.maxSequence
                        }
                        resolve(data.styleSheet);
                    }
                    else
                        reject();
                }, err => reject(err));
        }
        else {
            resolve([]);
        }
    });
}

fetchRolesDetails(id?: number) {
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
            this.apiService.get('/' + this._shared.apiBase + '/roles/' + this._shared.id)
                .subscribe(data => {
                    if (data.roles) {
                        if (data.maxSequence) {
                            this._shared.rolesDetailsSeq = data.maxSequence
                        }
                        resolve(data.roles);
                    }
                    else
                        reject();
                }, err => reject(err));
        }
        else {
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
                this.router.navigateByUrl('/concurrent-programs/' + this._shared.id + (exit ? '' : '/edit'))
              } else {
                if (exit)
                    this.router.navigateByUrl('/concurrent-programs/' + this._shared.id);
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

      //Checking if inputs are valid in header
      let inputs = this.inputService.getInput(this._shared.headerPath);
      if (inputs) {
        inValid = Object.keys(inputs).some(key => {
            if (inputs[key] && inputs[key].isEdit && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
                return true;
            }
        });
      }
      // Checking if inputs are valid in lines
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
      let custumalidation = false;
      if(!inValid){
        inValid = custumalidation = this._shared.customValidation();
      }
      if (inValid) {
          if(custumalidation){
              reject("Required parameter count should not be greater than number of parameters")
          }
          else
            reject('Please fill mandatory fields.');
      } else {
          let saveData = this._cache.getCachedValue(this._shared.appPath);
          // Adding the removedkeys as active - N to remove them
          if (saveData) {

              this._shared.lineKeys.forEach(key => {
                  if (!saveData[key]) {
                      saveData[key] = [];
                  }
                  let removedPath = this._shared[key + 'RemovedKeysPath'];
                  let linePrimaryKey = this._shared[key + 'PrimaryKey']
                  let cache = this._cache.getCachedValue(removedPath)
                  if (cache && cache.length) {
                      cache.forEach(removedPrimaryKey => {
                          let json = { 'active': 'D' };
                          json[linePrimaryKey] = removedPrimaryKey;
                          saveData[key].push(json)
                      });
                  }
              });
              let observable;
            //   console.log(saveData)
              this.saveUploadFiles(saveData);
              if (id == 0) {
                observable = this.apiService.post('/concurrent-programs/create-concurrent-program', saveData)
              } else {
                observable = this.apiService.put('/concurrent-programs/update-concurrent-program/' + id, saveData)
              }
              observable
                  .catch(err => {
                      reject(err);
                      // return err;
                  })
                  .subscribe(res => {
                      if (res && res.success) {
                          this._shared.id = res.data && res.data.pgmId ? res.data.pgmId : this._shared.id;
                          resolve(res)
                      } else {
                          reject(res && res.message ? res.message : 'Unknown error');
                      }
                  })
          } else {
              reject('No changes detected');
          }
      }
  });
}

deleteDetailsLine(key, index, model) {
    this._shared.deleteLine(key, index);
}

deleteLines(key) {
    if (this._shared.selectedLines[key] && this._shared.selectedLines[key].length) {
        let primaryKey = this[key + 'PrimaryKey'];
        let dialogRef = this._dialog.open(ConfirmPopupComponent);
        dialogRef.componentInstance.dialogTitle = 'Delete selected record(s)';
        dialogRef.componentInstance.message = 'Are you sure you want to delete the selected ' + this._shared.selectedLines[key].length + ' record(s)'
        dialogRef.afterClosed().subscribe(flag => {
            if (flag) {
                this._shared.selectedLines[key].forEach(line => {
                    let index = this._shared.formData[key].findIndex(data => {
                        let model = this._shared.getLineModel(key,data)
                        return model.equals(line)
                    });
                    this.deleteDetailsLine(key, index, line);
                });
                this._shared.setSelectedLines(key, [])
            }
        })
    }
}

getSavedCacheData(){
    let saveData = this._cache.getCachedValue(this._shared.appPath);
          // Adding the removedkeys as active - N to remove them
          if (saveData) {

              this._shared.lineKeys.forEach(key => {
                  if (!saveData[key]) {
                      saveData[key] = [];
                  }
                  let removedPath = this._shared[key + 'RemovedKeysPath'];
                  let linePrimaryKey = this._shared[key + 'PrimaryKey']
                  let cache = this._cache.getCachedValue(removedPath)
                  if (cache && cache.length) {
                      cache.forEach(removedPrimaryKey => {
                          let json = { 'active': 'N' };
                          json[linePrimaryKey] = removedPrimaryKey;
                          saveData[key].push(json)
                      });
                  }
              });
            }
        return saveData;
}

exportAllData() {
    return new Promise((resolve, reject) => {
        this.apiService.get('/' + this._shared.apiBase + '/export-all-data')
            .subscribe(data => {
                if (data) {
                    if (data.exportData) {
                        resolve(data.exportData);
                    }
                }
                else
                    reject();
            }, err => reject(err));
        
    });
}

exportData(ids) {
    return new Promise((resolve, reject) => {
        this.apiService.post('/' + this._shared.apiBase + '/export-data',ids)
            .subscribe(data => {
                if (data) {
                    if (data.exportData) {
                        resolve(data.exportData);
                    }
                }
                else
                    reject();
            }, err => reject(err));
        
    });
}

async saveUploadFiles(saveData){
    if(saveData && saveData.templatesDetails){
      const templateFormData = new FormData();
      saveData.templatesDetails.forEach(template=>{
        if(template){
          let index = this._shared.templatesFiles.findIndex((elem)=>{
            return elem.name === template.fileName
          });
          let file = this._shared.templatesFiles[index];
          if(file){
            templateFormData.append('file', file);
          }
        }
      })
      if(templateFormData.has('file')){
        await this.apiService.postMultipartTrendzBi("/programs/templates",templateFormData).subscribe();
      }
    }
    if(saveData && saveData.styleSheetDetails){
        const styleSheetFormData = new FormData();
        saveData.styleSheetDetails.forEach(styleSheet=>{
          if(styleSheet){
            let index = this._shared.styleSheetFiles.findIndex((elem)=>{
              return elem.name === styleSheet.fileName
            });
            let file = this._shared.styleSheetFiles[index];
            if(file){
                styleSheetFormData.append('file', file);
            }
          }
        })
        if(styleSheetFormData.has('file')){
            await this.apiService.postMultipartTrendzBi("/programs/templates",styleSheetFormData).subscribe();
        }
      }
  }

  downloadFile(fileName){
      this.apiService.trendzBiDownloadFile("/programs/templates",fileName);
  }

  checkDuplicateShortCode(shortCode){
    return new Promise((resolve, reject) => {
        if(shortCode){
            this.apiService.post('/' + this._shared.apiBase + '/import-shorCode-validation',shortCode)
            .subscribe(data => {
                if (data) {
                    resolve(data); 
                }
                else
                    reject();
            }, err => reject(err));
        }
        else{
            reject();
        }
        
    });
      
  }

  saveImportData(saveData){
    return new Promise((resolve, reject) => {
        if(saveData){
            this.apiService.post('/' + this._shared.apiBase + '/save-import-data',saveData)
            .subscribe(data => {
                if (data.status == 'S') {
                    if(data.error.length > 0){
                        const window = this._dialog.open(ConfirmPopupComponent);
                        window.componentInstance.dialogTitle = "Warning";
                        let msg = "Some programs are not inserted. Could not find executable for following programs.\n ";
                        data.error.forEach(shortCode=>{
                            if(shortCode)
                                msg = msg + "\n" + shortCode
                        });
                        window.componentInstance.message = msg;
                        window.componentInstance.confirmText = 'OK';
                        window.afterClosed().subscribe(res=>{
                            this.alertUtils.showAlerts(data.message);
                            resolve(true);
                        })
                    }else{
                        this.alertUtils.showAlerts(data.message);
                        resolve(true); 
                    }
                }
                else{
                    this.alertUtils.showAlerts(data.message);
                    resolve(false); 
                }
            }, err => reject(err));
        }
        else{
            reject();
        }
    });
  }

}
