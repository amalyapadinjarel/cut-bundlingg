import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';
import { PackingInstructionsSharedService } from './packing-instructions-shared.service';
import { Location } from '@angular/common';
import { style } from '@angular/animations';


@Injectable({
  providedIn: 'root'
})
export class PackingInstructionsService {

  constructor(
    private apiService: ApiService,
    private _shared: PackingInstructionsSharedService,
    public inputService: TnzInputService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public router: Router,
    private _dialog: MatDialog,
    private location: Location
  ) { }

  fetchFormData(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
        this.apiService
          .get("/" + this._shared.apiBase + "/" + this._shared.poId + "/" + this._shared.orderId + "/" + this._shared.parentProductId)
          .subscribe(
            (data) => {
              if (data.packingInstruction) {
                this._shared.id = data.csId;
                this._shared.styleId = data.packingInstruction.style
                this._shared.setIsCartonGenerated(Number(data.carton));
                resolve(data.packingInstruction);
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
    if (!this._shared.poId && !this._shared.orderId && !this._shared.parentProductId) {
      let data = this._shared.setLinesFromCache(key, []);
      this._shared.formData[key] = data;
      this._shared[key + "Loading"] = false;
      this._shared["refresh" + key].next(true);
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
          this._shared["refresh" + key].next(true);
          this._shared[key + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        }
      );
    }
  }

  fetchLinesData(key, id?) {
    switch (key) {
      case 'packsDetails':
        return this.fetchPackDetails(this._shared.poId, this._shared.orderId, this._shared.parentProductId);
      case 'carton':
        return this.fetchCartonDetails(this._shared.poId, this._shared.orderId, this._shared.parentProductId);
      default:
        break;
    }
  }

  fetchPackDetails(poId?, orderId?, parentProductId?) {
    return new Promise((resolve, reject) => {
      if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
        this.apiService.get('/' + this._shared.apiBase + '/packs/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId)
          .subscribe(data => {
            if (data.packDetails) {
              if (data.maxSequence) {
                this._shared._packsDetailsSeq = data.maxSequence + 1
              }
              resolve(this.groupData(data.packDetails));
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

  save(id?: number): Promise<any> {
    this._shared.loading = true;
    return new Promise((resolve, reject) => {
      this.saveData(id || this._shared.id)
        .then(res => {
          this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
          this._shared.loading = false;
          this._shared.refreshData.next(true);
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
        saveData = this.formatSaveData(saveData);
        // console.log(saveData)
        let saveObservable;
        let validateObservable;
        let isValid = this._shared.validateQuantity(saveData)
        let inValid;
        if (isValid == true) {
          validateObservable = this.apiService.post('/packing-instructions/save-packs-validation', saveData);
          validateObservable.catch(err => { reject(err) })
            .subscribe(res => {
              if (res && res.flag) {
                saveObservable = this.apiService.post('/packing-instructions/save-packs', saveData);
                saveObservable
                  .catch(err => {
                    reject(err);
                  })
                  .subscribe(res => {
                    if (res && res.status == 'S') {
                      this.shortOrExcessUpdated(saveData);
                      resolve(res);
                      this._shared.refreshList = true;
                    } else {
                      reject(res && res.message ? res.message : 'Unknown error');
                    }
                  })
              } else {
                reject(res && res.message ? res.message : 'Quantity validation failed');
              }
            })
        }
        else {
          reject(isValid);
        }

      } else {
        reject('No changes detected');
      }
    });
  }

  deleteDetailsLine(key, index, model) {
    this._shared.deleteLine(key, index);
  }

  deleteLines(key) {
    let length = 0;
    if (this._shared.selectedLines) {
      this._shared.selectedLines.forEach(elem => {
        length = length + elem.length;
      })
    }
    if (this._shared.selectedLines && length > 0) {
      let primaryKey = this[key + 'PrimaryKey'];
      let dialogRef = this._dialog.open(ConfirmPopupComponent);
      dialogRef.componentInstance.dialogTitle = 'Delete selected record(s)';
      dialogRef.componentInstance.message = 'Are you sure you want to delete the selected ' + length + ' record(s)'
      dialogRef.afterClosed().subscribe(flag => {
        if (flag) {
          this._shared.selectedLines.forEach((elem, index1) => {
            if (elem) {
              elem.forEach(line => {
                let index = this._shared.formData[key].grpData[index1].findIndex(data => {
                  let model = this._shared.getLineModel(key, data)
                  return model.equals(line)
                });
                if (index != -1) {
                  this._shared.deleteSolidLine(key, index, index1);
                }
              })
            }
          })
          this._shared.selectedLines = [];
        }
      })
    }
  }

  getSavedCacheData() {
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

  fetchSolidPacksDetails() {
    return new Promise((resolve, reject) => {
      if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
        this.apiService
          .get("/" + this._shared.apiBase + "/solid-packs/" + this._shared.poId + "/" + this._shared.orderId + "/" + this._shared.parentProductId)
          .subscribe(
            (data) => {
              if (data.solidPack) {
                resolve(data.solidPack);
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

  fetchRatioPacksDetails() {
    return new Promise((resolve, reject) => {
      if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
        this.apiService
          .get("/" + this._shared.apiBase + "/ratio-packs/" + this._shared.poId + "/" + this._shared.orderId + "/" + this._shared.parentProductId)
          .subscribe(
            (data) => {
              if (data.ratioPack) {
                resolve(data.ratioPack);
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

  public resetInputCache(key) {
    this.inputService.resetInputCache(this._shared.appKey);
  }

  public resetInputCacheWithKey(key) {
    this.inputService.resetInputCache(key);
  }

  groupData(listData: any) {
    listData.sort(function (a, b) {
      return a.sequence - b.sequence;
    });
    let grpKeys = [];
    let mainIndex = 0;
    let grpData = [];
    listData.forEach(elem => {
      let flag = false;
      grpKeys.forEach(val => {
        if (elem.packType == 'SOLID' && val.packType == elem.packType && val.qntyPerCtn == elem.qntyPerCtn) {
          flag = true;
        }
      })
      if (!flag && elem.packType != 'RATIO') {
        grpKeys.push({ packType: elem.packType, qntyPerCtn: elem.qntyPerCtn, noOfCartons: elem.noOfCartons, csPackId: elem.csPackId, short: elem.short, excess: elem.excess });
        grpData.push([]);
      }
      if (!flag && elem.packType == 'RATIO') {
        grpKeys.push(elem);
        grpData.push(elem);
      }
    });
    grpKeys.forEach((val, index) => {

      listData.forEach(elem => {
        if (val.packType == elem.packType && val.qntyPerCtn == elem.qntyPerCtn && elem.packType == 'SOLID') {
          grpData[index].push(elem);
        }
      });
    });
    // listData.forEach(elem=>{
    //   if(elem.packType == 'RATIO'){
    //     grpKeys.push(elem);
    //     grpData.push(elem);
    //   }
    // })
    let retData = {
      grpKey: grpKeys,
      grpData: grpData,
      length: grpKeys.length
    }
    return retData;
  }

  formatSaveData(model) {
    let data: any = {};
    data.csId = this._shared.id;
    data.orderId = Number(this._shared.orderId);
    data.style = Number(this._shared.parentProductId);
    data.po = this._shared.poId;
    data.packsDetails = model.packsDetails;
    data.description = model.header ?.description;
    this._shared.formData['packsDetails'].grpKey.forEach((val, index) => {
      if (model[index]) {
        try {
          model[index].forEach(elem => {
            if (elem) {
              data.packsDetails.push(elem);
            }
          });
        }
        catch (err) {
          // model[index].packType = val.packType;
          data.packsDetails.push(model[index]);
        }
      }
    });
    data.packsDetails.forEach(elem => {
      if (elem) {
        if (elem.packType == 'RATIO') {
          let size = [];
          elem.color.forEach(y => {
            y.size.forEach(x => {
              size.push(x);
            })
          });
          elem.size = size;
        }
      }
    })
    return data;
  }

  fetchCartonDetails(poId?, orderId?, parentProductId?) {
    return new Promise((resolve, reject) => {
      if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
        this.apiService.get('/' + this._shared.apiBase + '/carton-list/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId)
          .subscribe(data => {
            if (data.cartonDetails) {
              resolve(data.cartonDetails);
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

  generateCarton(isRegenerate) {
    return new Promise((resolve, reject) => {
      if (this._shared.id) {
        let regenerate = isRegenerate == 'Y' ? 1 : 0;
        this.apiService.get('/' + this._shared.apiBase + '/generate-carton/' + this._shared.id + '/' + isRegenerate)
          .subscribe(data => {
            if (data && data.data.returnCode == 1) {
              this.alertUtils.showAlerts(data.data.message);
              this._shared.refreshData.next(true);
              resolve(true);
            }
            else {
              this.alertUtils.showAlerts(data.data.message);
              reject(false);
            }
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }

  validateCartonDelete() {
    return new Promise((resolve, reject) => {
      if (this._shared.id && this._shared.isCartonGenerated) {
        this.apiService.get('/' + this._shared.apiBase + '/validate-carton-delete/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId)
          .subscribe(data => {
            if (data) {
              resolve(data.count);
            }
          }, err => reject(err));
      }
      else {
        this.alertUtils.showAlerts("No carton generated");
        resolve([]);
      }
    });
  }

  deleteCarton() {
    return new Promise((resolve, reject) => {
      if (this._shared.id && this._shared.isCartonGenerated) {
        this.apiService.get('/' + this._shared.apiBase + '/carton-delete/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId)
          .subscribe(data => {
            if (data) {
              resolve(true);
            }
          }, err => reject(err));
      }
      else {
        this.alertUtils.showAlerts("No carton generated");
        resolve([]);
      }
    });
  }

  loadStyleVarientData() {
    if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
      this.apiService.get('/' + this._shared.apiBase + '/packs-quantity-details/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId)
        .subscribe(data => {
          if (data.allProducts) {
            this._shared.styleVarientDetails = data.allProducts
          }
        });
    }
    else {
    }
  }

  deleteCartonPerPack(csPackId) {
    return new Promise((resolve, reject) => {
      if (this._shared.id && this._shared.isCartonGenerated && csPackId) {
        this.apiService.put('/' + this._shared.apiBase + '/carton-delete-per-pack/' + csPackId)
          .subscribe(data => {
            if (data) {
              resolve(data.message == 1 ? true : false);
            }
          }, err => reject(err));
      }
      else {
        this.alertUtils.showAlerts("No carton generated");
        resolve([]);
      }
    });
  }

  deleteCartonPerPackValidation(csPackId) {
    return new Promise((resolve, reject) => {
      if (this._shared.id && csPackId) {
        this.apiService.put('/' + this._shared.apiBase + '/carton-delete-repack-validation/' + csPackId)
          .subscribe(data => {
            if (data) {
              if (data.message && data.message.activeCartonCount == 0) {
                this.alertUtils.showAlerts("No active cartons exists for the pack");
                resolve(false);
              }
              else if (data.message && data.message.packOrOnholdCartonCount != 0) {
                this.alertUtils.showAlerts("Carton deletion failed. One or more carton is in PACKED or ONHOLD status");
                resolve(false);
              }
              else if (data.message && data.message.activeCartonCount != 0 && data.message.packOrOnholdCartonCount == 0) {
                if (data.message.shortQty == 0 && data.message.excessQty == 0) {
                  resolve(true);
                }
                else {
                  this.alertUtils.showAlerts("Carton deletion failed since short/excess quantity exist.");
                  resolve(false);
                }
              }
              resolve(false);
            }
          }, err => reject(err));
      }
      else {
        this.alertUtils.showAlerts("No carton generated");
        resolve([]);
      }
    });
  }

  rePackCartonValidation(csPackId) {
    return new Promise((resolve, reject) => {
      if (this._shared.id && csPackId) {
        this.apiService.put('/' + this._shared.apiBase + '/carton-delete-repack-validation/' + csPackId)
          .subscribe(data => {
            if (data) {
              if (data.message && data.message.activeCartonCount == 0) {
                this.alertUtils.showAlerts("No active cartons exists for the pack");
                resolve(false);
              }
              else if (data.message && data.message.packOrOnholdCartonCount != 0) {
                resolve(true);
              }
              else if (data.message && data.message.activeCartonCount != 0 && data.message.packOrOnholdCartonCount == 0) {
                this.alertUtils.showAlerts("Carton repack failed. No carton with PACKED or ONHOLD status");
                resolve(false);
              }
              resolve(false);
            }
          }, err => reject(err));
      }
      else {
        this.alertUtils.showAlerts("No carton generated");
        resolve([]);
      }
    });
  }

  sendMessage(message) {
    this.apiService.baseUrlPost("production-tracking/socket-message", message).subscribe();
  }

  loadDefaultFacility() {
    return new Promise((resolve, reject) => {
      this.apiService.get('/' + this._shared.apiBase + '/default-facility')
        .subscribe(data => {
          if (data) {
            resolve(data.defaultFacility);
          }
        }, err => reject(err));
    });
  }

  shortOrExcessUpdated(saveData) {
    let shortOrExcessData = [];
    saveData.packsDetails.forEach(data => {
      let keys = Object.keys(data);
      if (keys && (keys.includes("short") || keys.includes("excess"))) {
        let temp = {};
        if (keys.includes("short"))
          temp["short"] = data.short;
        if (keys.includes("excess"))
          temp["excess"] = data.excess;
        temp["packId"] = data.csPackId;
        shortOrExcessData.push(temp);
      }
    });
    if (shortOrExcessData.length != 0) {
      let pushMessage = {
        appIdentifier: 'PACKING',
        action: 'SHORT_OR_EXCESS_UPDATED',
        content: {
          style: this._shared.styleId,
          purchaseOrder: this._shared.poId,
          shortOrExcessData: shortOrExcessData
        }
      };
      this.sendMessage(pushMessage);
    }
  }

  deleteCartonLines() {
    this.validateCartonDelete().then(data => {
      if (data == 0) {
        const dialog = this._dialog.open(ConfirmPopupComponent);
        dialog.componentInstance.dialogTitle = 'Warning';
        dialog.componentInstance.message = 'Are you sure to delete all carton?';
        dialog.componentInstance.confirmText = 'Delete';
        dialog.afterClosed().subscribe(data => {
          if (data) {
            this.deleteCarton().then(data => {
              let packIds = this._shared.fetchAllPackIds();
              let pushMessage = {
                appIdentifier: 'PACKING',
                action: 'PACK_DELETED',
                content: packIds
              };
              this.sendMessage(pushMessage);
              this._shared.refreshData.next(true);
              this.loadData('carton');
            })
          }
        })
      }
      else {
        this.alertUtils.showAlerts("One or more carton is not in OPEN status or has excess or short quantity");
      }
    })
  }

  generateCartonLines() {
    if (this._shared.totalPacks > 0) {
      this.generateCarton('Y').then(data => {
        let pushMessage = {
          appIdentifier: 'PACKING',
          action: 'PACK_GENERATED',
          content: {
            style: this._shared.styleId,
            purchaseOrder: this._shared.poId
          }
        };
        this.sendMessage(pushMessage);
      })
    }
    else {
      this.alertUtils.showAlerts("Failed to generate cartons. No packs created");
    }
  }

}