import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PackingInstructionsSharedService } from "../../../services/packing-instructions-shared.service";
import { PackingInstructionsService } from "../../../services/packing-instructions.service";
import { SmdDataTable } from "app/shared/component";
import { AlertUtilities } from "app/shared/utils";
import { TnzInputService } from "app/shared/tnz-input/_service/tnz-input.service";
import { PacksDetails, ratioDetails } from "../../../models/packDeatils";
import { LocalCacheService } from "app/shared/services";

@Component({
  selector: "app-add-packs",
  templateUrl: "./add-packs.component.html",
  styleUrls: ["./add-packs.component.scss"],
})
export class AddPacksComponent implements OnInit {
  addType = 0; //0-> solid 1-> ratio
  title: String = "";
  TempformData: any;
  sizeArray: any = [];
  @ViewChild(SmdDataTable, { static: false }) dataTable: SmdDataTable;

  constructor(
    private dialogRef: MatDialogRef<AddPacksComponent>,
    public _shared: PackingInstructionsSharedService,
    public servcie: PackingInstructionsService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    private _cache: LocalCacheService
  ) {}

  ngOnInit(): void {
    this.resetCache();
    if (this.addType == 0) this.title = "Add Solid Pack";
    else this.title = "Add Ratio Pack";
    this.fetchData(this.addType);
  }

  ngOnDestroy() {}

  close(isCancel: boolean) {
    if (isCancel) {
      //Check if valid
      let inValid = false;
      if (this.addType == 0) {
        if (!inValid) {
          let inputs = this.inputService.getInput(
            this._shared["solidPack" + "Path"]
          );
          if (inputs) {
            inValid = inputs.some((grp) => {
              if (grp) {
                return Object.keys(grp).some((key) => {
                  if (
                    grp[key] &&
                    grp[key].status != "ok" &&
                    grp[key].status != "changed"
                  ) {
                    return true;
                  }
                });
              }
            });
          }
        }
        if (inValid) {
          this.alertUtils.showAlerts("Please enter valid data");
        } else {
          let modelData = [];
          this.dataTable.models.forEach((elem) => {
            if (
              elem.orderQty != "" &&
              elem.orderQty != null &&
              elem.orderQty != 0
            ) {
              elem.packType = this.addType == 0 ? "SOLID" : "RATIO";
              modelData.push(elem);
            }
          });
          this.resetCache();
          modelData.sort(function (a, b) {
            return a.sequence - b.sequence;
          });
          this.dialogRef.close(modelData);
        }
      } else {
        if (!inValid) {
          let inputs = this.inputService.getInput(
            this._shared["ratioPack" + "Path"]
          );
          if (inputs) {
            inValid = inputs.some((grp) => {
              if (grp) {
                return Object.keys(grp).some((key) => {
                  if (
                    grp[key] &&
                    grp[key].status != "ok" &&
                    grp[key].status != "changed"
                  ) {
                    return true;
                  }
                });
              }
            });
          }
          if (inValid) {
            this.alertUtils.showAlerts("Please enter valid data");
          } else {
            let modelData = [];
            let cacheData = this._cache.getCachedValue(
              this._shared.ratioPackPath
            );
            let headerData = this._cache.getCachedValue(
              this._shared.ratioPackHeaderPath
            )[0];
            let qtyPerCarton = 0;
            let uom = 0;
            let color = [];
            this.TempformData.forEach((element, index) => {
              uom = Number(element.uom);
              let tempdata = { name: element.colorValue, size: [] };
              let cdata = cacheData[index];
              if (cacheData[index]) {
                element.size.forEach((elem) => {
                  if (cdata[elem.sizeValue]) {
                    elem.value = cdata[elem.sizeValue];
                    qtyPerCarton = qtyPerCarton + Number(elem.value);
                    tempdata.size.push(elem);
                  }
                });
                color.push(tempdata);
              }
            });
            let data = {
              packType: "RATIO",
              noOfCartons: Number(headerData.noOfCartons),
              qntyPerCtn: qtyPerCarton,
              orderQty: Number(headerData.noOfCartons) * Number(qtyPerCarton),
              color: color,
              uom: uom,
            };
            if (this.validateQty(data)) {
              this.alertUtils.showAlerts(
                "Specified quantity is greater than order quantity"
              );
            } else {
              this.resetCache();
              this.dialogRef.close(data);
            }
          }
        }
      }
    } else {
      this.resetCache();
      this.dialogRef.close(null);
    }
  }

  fetchData(type) {
    if (type == 0) {
      this.servcie.fetchSolidPacksDetails().then((data) => {
        if (data) {
          this._shared.setLines("solidPack", data);
          this._shared.formData["solidPack"] = data;
          this._shared["solidPack" + "Loading"] = false;
          this.TempformData = [];
          this._shared.formData["solidPack"].forEach((val) => {
            this.TempformData.push(new PacksDetails(val));
          });
          this.refreshTable();
        }
        (err) => {
          this._shared["solidPack" + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        };
      });
    }
    if (type == 1) {
      this.servcie.fetchRatioPacksDetails().then((data) => {
        if (data) {
          this.sizeArray = [];
          this.TempformData = [];
          this._shared.setLines("ratioPack", data);
          this._shared.formData["ratioPack"] = data;
          this._shared["ratioPack" + "Loading"] = false;
          this._shared.formData["ratioPack"].forEach((val) => {
            this.TempformData.push(new ratioDetails(val));
            val.size.forEach((element) => {
              this.checkDuplicateAndPush(element);
            });
          });
          this.TempformData = this.formatData(this.TempformData);
          this._shared.formData["ratioPack"] = this.TempformData;
          this.refreshTable();
        }
        (err) => {
          this._shared["ratioPack" + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        };
      });
    }
  }

  onRowSelected() {}

  refreshTable() {
    if (this.addType == 0)
      this.dataTable.refresh(this._shared.formData["solidPack"]);
  }

  valueChanged(event, key, index?) {
    if (key == "qntyPerCtnTemp") {
      if (this.addType == 0 && this._shared.formData["solidPack"])
        this.modifyData(event.value);
    } else if (key == "qntyPerCtn") {
      if (this.addType == 0 && this._shared.formData["solidPack"]) {
        this._shared.formData["solidPack"][index].qntyPerCtn = Number(
          event.value
        );
        this._shared.formData["solidPack"][index].noOfCartons = Math.ceil(
          Number(this._shared.formData["solidPack"][index].orderQty) /
            Number(event.value)
        );
        this.refreshTable();
        setTimeout(() => {
          this.goToNextInput(key, index);
        }, 0);
      }
    } else if (key == "orderQty") {
      if (this.addType == 0 && this._shared.formData["solidPack"]) {
        if (event.value == "") {
          this._shared.formData["solidPack"][index].noOfCartons = "";
          this._shared.formData["solidPack"][index].orderQty = "";
        } else if (Number(event.value) > 0) {
          if (event.value <= this.TempformData[index].orderQty) {
            this._shared.formData["solidPack"][index].orderQty = Number(
              event.value
            );
            this._shared.formData["solidPack"][index].noOfCartons = Math.ceil(
              Number(
                Number(event.value) /
                  Number(this._shared.formData["solidPack"][index].qntyPerCtn)
              )
            );
            this.refreshTable();
            setTimeout(() => {
              this.goToNextInput(key, index);
            }, 0);
          } else {
            this.inputService.setError(
              event.path,
              "Order qnty cannot be greater than " +
                this.TempformData[index].orderQty
            );
          }
        } else {
          this.inputService.setError(event.path, "Order qnty cannot be 0");
        }
      }
    } else if (key == "sequence") {
      if (this.addType == 0 && this._shared.formData["solidPack"]) {
        this._shared.formData["solidPack"][index].sequence = Number(
          event.value
        );
      }
    }
  }

  modifyData(val) {
    this._shared.formData["solidPack"].forEach((elem) => {
      elem.qntyPerCtn = Number(val);
      elem.noOfCartons = Math.ceil(Number(elem.orderQty) / Number(val));
    });
    this.refreshTable();
  }

  checkDuplicateAndPush(elem) {
    let flag = false;
    this.sizeArray.forEach((element) => {
      if (element.sizeValue == elem.sizeValue) flag = true;
    });
    if (!flag) {
      this.sizeArray.push(elem);
    }
  }

  ratioValueChanged(event, i, y) {}

  resetCache() {
    this.servcie.resetInputCacheWithKey(this._shared.solidPackPath);
    this.servcie.resetInputCacheWithKey(this._shared.ratioPackHeaderPath);
    this.servcie.resetInputCacheWithKey(this._shared.ratioPackPath);
  }

  validateQty(model) {
    let flag = false;
    model.color.forEach((elem, index) => {
      elem["size"].forEach((element, index2) => {
        if (
          Number(model.noOfCartons) * Number(element.value) >
          Number(element.orderQty)
        ) {
          this.inputService.setError(
            "po.0.ratioPack" + "[" + index + "]." + element.sizeValue,
            "Specified quantity is greater than order quantity(" +
              element.orderQty +
              ")"
          );
          flag = true;
        }
      });
    });
    return flag;
  }

  formatData(model) {
    let data = [];
    model.forEach((x) => {
      let sizeValue = [];
      this.sizeArray.forEach((y) => {
        let flag = false;
        x.size.forEach((z) => {
          if (y.sizeValue == z.sizeValue) {
            flag = true;
            sizeValue.push(z);
          }
        });
        if (!flag) {
          sizeValue.push([]);
        }
      });
      let temp = new ratioDetails(x);
      temp.size = sizeValue;
      data.push(temp);
    });
    return data;
  }

  goToNextInput(key, index) {
    let element = document.getElementById(
      "solidPack[" + (index + 1) + "].qntyPerCtn"
    );
    if (element) {
      setTimeout(() => element.focus(), 0);
    }
  }
}
