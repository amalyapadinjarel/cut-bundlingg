import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PackingInstructionsSharedService } from "../../../services/packing-instructions-shared.service";
import { PackingInstructionsService } from "../../../services/packing-instructions.service";
import { SmdDataTable } from "app/shared/component";
import { AlertUtilities } from "app/shared/utils";
import { TnzInputService } from "app/shared/tnz-input/_service/tnz-input.service";
import { PacksDetails, ratioDetails } from "../../../models/packDeatils";
import { LocalCacheService } from "app/shared/services";
import { packingMethodLovconfig, facilityLovconfig, workCenterLovConfig } from '../../../models/lov-config';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { ChoiceList } from 'app/models/common.model';

@Component({
  selector: "app-add-packs",
  templateUrl: "./add-packs.component.html",
  styleUrls: ["./add-packs.component.scss"],
})
export class AddPacksComponent implements OnInit {
  addType = 0; //0-> solid 1-> ratio
  title: String = "";
  TempformData: any = [];
  sizeArray: any = [];
  totalRatioSum = 0;
  packQty = 0;
  packingMethod = JSON.parse(JSON.stringify(packingMethodLovconfig));
  facilityLov = JSON.parse(JSON.stringify(facilityLovconfig));
  // workCenterLov = JSON.parse(JSON.stringify(packingMethodLovconfig));
  @ViewChild(SmdDataTable, { static: false }) dataTable: SmdDataTable;

  constructor(
    private dialogRef: MatDialogRef<AddPacksComponent>,
    public _shared: PackingInstructionsSharedService,
    public servcie: PackingInstructionsService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    private _cache: LocalCacheService
  ) { }

  ngOnInit(): void {
    this.resetCache();
    if (this.addType == 0) 
      this.title = "Add Solid Pack";
    else this.title = "Add Ratio Pack";
      this.fetchData(this.addType);
    this._shared.addSolidPacksDetailsSeq = 0
    
  }

  ngOnDestroy() { }

  workCenterLov(index,feild) {
    let cache;
    if(this.addType == 0){
      cache = this._cache.getCachedValue(this._shared.getSolidPackDetailsPath(index,feild))
    }
    else{
      cache = this._cache.getCachedValue(this._shared.getRatioPacksHeaderPath(index,feild))
    }
    return JSON.parse(JSON.stringify(workCenterLovConfig(cache ? cache.value != "" ? cache.value: 0 : 0)));
  }

  workCenterLovForSolidLines(index,feild){
    let cache = this._cache.getCachedValue(this._shared.getSolidPackDetailsPath(index,feild))
    return JSON.parse(JSON.stringify(workCenterLovConfig(cache ? cache.value != "" ? cache.value: 0 : 0)));
  }

  loadDefaultFacility(){
    this.servcie.loadDefaultFacility().then((res:ChoiceList)=>{
      if(res.label && res.value && this.addType == 0){
        this.inputService.updateInput(this._shared.getSolidPackDetailsPath(0,'facilityTemp'),res);
      }
      if(res.label && res.value && this.addType == 1){
        this.inputService.updateInput(this._shared.getRatioPacksHeaderPath(0,'facility'),res);
      }
    })
  }

  close(isCancel: boolean) {
    if (isCancel) {
      //Check if valid
      let inValid = false;
      if (this.addType == 0) {
        this.validateSolidPack();
        if (!inValid) {
          let inputs = this.inputService.getInput(
            this._shared["solidPack" + "Path"]
          );
          if (inputs) {
            inValid = inputs.some((grp) => {
              if (grp) {
                return Object.keys(grp).some((key) => {
                  if ( grp[key] && grp[key].status != "ok" &&grp[key].status != "changed" ) {
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
            if ( elem.orderQty != "" && elem.orderQty != null &&elem.orderQty != 0 ) {
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
          let inputs = this.inputService.getInput(this._shared["ratioPackPath"]);
          if (inputs) {
            inValid = inputs.some((grp) => {
              if (grp) {
                return Object.keys(grp).some((key) => {
                  if (grp[key] && grp[key].status != "ok" &&grp[key].status != "changed") {
                    return true;
                  }
                });
              }
            });
          }
          inputs = this.inputService.getInput(this._shared["ratioPackHeaderPath"]);
          if (inputs) {
            inValid = inputs.some((grp) => {
              if (grp) {
                return Object.keys(grp).some((key) => {
                  if (grp[key] && grp[key].status != "ok" &&grp[key].status != "changed") {
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
            let cacheData = this._cache.getCachedValue(this._shared.ratioPackPath );
            let headerData = this._cache.getCachedValue(this._shared.ratioPackHeaderPath)[0];
            let qtyPerCarton = 0;
            let uom = 0;
            let color = [];
            this.TempformData.forEach((element, index) => {
              uom = Number(element.uom);
              let tempdata = { name: element.colorValue, size: [] };
              let cdata = cacheData[index];
              if (cacheData[index]) {
                element.size.forEach((elem) => {
                  if (cdata[elem.sizeValue] && cdata[elem.sizeValue] != 0) {
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
              qntyPerCtn: Number(qtyPerCarton) * Number(headerData.prePack),
              orderQty: headerData.packQty,
              packingMethod: headerData.packingMethod,
              prePack: headerData.prePack,
              packQty: headerData.packQty,
              color: color,
              sumOfRatios: Number(qtyPerCarton),
              uom: uom,
              facility: headerData.facility,
              workCenter: headerData.workCenter
            };
            if (this.validateQty(data)) {
              this.alertUtils.showAlerts(
                "Specified quantity is greater than order quantity"
              );
            } else {
              this.resetCache();
              if(data.orderQty != 0 ){
                this.dialogRef.close(data);
              }
              else{
                this.dialogRef.close(null);
              }
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
          this.TempformData = [];
          this._shared.formData["solidPack"].forEach((val) => {
            val.sequence = this._shared.addSolidPacksDetailsSeq;
            this.TempformData.push(new PacksDetails(val));
          });
          this._shared["solidPack" + "Loading"] = false;
          this.refreshTable();
          this.loadDefaultFacility();
        }
        (err) => {
          this._shared["solidPack" + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        };
      });
    }
    if (type == 1) {
      this.inputService.updateInputCache(this._shared.getRatioPacksHeaderPath(0,'prePack'),1);
      this.servcie.fetchRatioPacksDetails().then((data) => {
        if (data) {
          this.packQty = 0;
          this.sizeArray = [];
          this.TempformData = [];
          this._shared.setLines("ratioPack", data);
          this._shared.formData["ratioPack"] = data;
          this._shared["ratioPack" + "Loading"] = false;
          this._shared.formData["ratioPack"].forEach((val) => {
            this.TempformData.push(new ratioDetails(val));
            val.size.forEach((element) => {
              this.checkDuplicateAndPush(element);
              this.packQty += element.unAddedPcs;
            });
          });
          this.sizeArray.push({sizeValue:'Total Units'});
          this.inputService.updateInput(this._shared.getRatioPacksHeaderPath(0,'packQty'),this.packQty);
          this.TempformData = this.formatData(this.TempformData);
          this._shared.formData["ratioPack"] = this.TempformData;
          this.refreshTable();
          this.loadDefaultFacility();
        }
        (err) => {
          this._shared["ratioPack" + "Loading"] = false;
          if (err) this.alertUtils.showAlerts(err.message, true);
        };
      });
    }
  }

  onRowSelected() { }

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
        this._shared.formData["solidPack"][index].qntyPerCtn = event.value;
        if(event.value && event.value != 0){
          this._shared.formData["solidPack"][index].noOfCartons = Math.ceil( Number(this._shared.formData["solidPack"][index].orderQty) / Number(event.value) );
        }else{
          this._shared.formData["solidPack"][index].noOfCartons = "";
          
        }
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
          this.refreshTable();
          setTimeout(() => {
            this.goToNextInput(key, index);
          }, 0);
        } else if (Number(event.value) > 0) {
          if (event.value <= this.TempformData[index].orderQty) {
            this._shared.formData["solidPack"][index].orderQty = Number(event.value);
            if(event.value && this._shared.formData["solidPack"][index].qntyPerCtn){
              this._shared.formData["solidPack"][index].noOfCartons = Math.ceil(Number(Number(event.value) / Number(this._shared.formData["solidPack"][index].qntyPerCtn)) );
            }
            else{
              this._shared.formData["solidPack"][index].noOfCartons = "";
            }
            this.refreshTable();
              setTimeout(() => {
                this.goToNextInput(key, index);
              }, 0);
          } else {
            this.inputService.setError(event.path,"Order qnty cannot be greater than " +this.TempformData[index].orderQty );
          }
        } else {
          this.inputService.setError(event.path, "Order qnty cannot be 0");
        }
      }
    } else if (key == "sequence") {
      if (this.addType == 0 && this._shared.formData["solidPack"]) {
        this._shared.formData["solidPack"][index].sequence = Number( event.value);
      }
    }
    else if( key == 'packQty'){
      if(this.totalRatioSum != 0){
        this.calculateNoOfCarton(event.value);
      }
    }
    else if( key == 'prePack'){
      if(this.totalRatioSum != 0){
        this.calculateNoOfCarton();
      }
    }
    else if( key == 'packingMethodTemp' && this.addType == 0){
      this.insertPackingMethodInAllLines(event.value);
    }
    else if( key == 'packingMethod' && this.addType == 0){
      this._shared.formData["solidPack"][index].packingMethod = event.value;
    }
    else if( key == 'facilityTemp' && this.addType == 0){
      this.insertFacilityInAllLines(event.value);
      if(event.value != ""){
        this.inputService.updateInputCache(this._shared.getSolidPackDetailsPath(0,'workCenterTemp'),"");
        this.insertWorkCenterInAllLines("");
        this.refreshTable();
      }
    }
    else if( key == 'facility' && this.addType == 0){
      this._shared.formData["solidPack"][index].facility = event.value;
      if(event.value != ""){
        this._shared.formData["solidPack"][index].workCenter = "";
        this.inputService.updateInputCache(this._shared.getSolidPackDetailsPath(index,'workCenter'),"");
      }
    }
    else if( key == 'workCenterTemp' && this.addType == 0){
      this.insertWorkCenterInAllLines(event.value);
    }
    else if( key == 'workCenter' && this.addType == 0){
      this._shared.formData["solidPack"][index].workCenter = event.value;
    }
  }

  modifyData(val) {
    this._shared.formData["solidPack"].forEach((elem) => {
      if(val){
        elem.qntyPerCtn = Number(val);
        elem.noOfCartons = Math.ceil(Number(elem.orderQty) / Number(val));
      }
      else{
        elem.noOfCartons = "";
        elem.qntyPerCtn = "";
      }
    });
    this.refreshTable();
  }

  insertPackingMethodInAllLines(val){
    this._shared.formData["solidPack"].forEach((elem) => {
      if(val){
        elem.packingMethod = val;
      }
    });
    this.refreshTable();
  }

  insertFacilityInAllLines(val){
    this._shared.formData["solidPack"].forEach((elem) => {
      if(val){
        elem.facility = val;
      }
    });
    this.refreshTable();
  }
  
  insertWorkCenterInAllLines(val){
    this._shared.formData["solidPack"].forEach((elem) => {
        elem.workCenter = val;
    });
    // this.refreshTable();
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

  ratioValueChanged(event, i, y,element) {
    let totalUnit = 0;
    let cacheData = this._cache.getCachedValue(this._shared.ratioPackPath );
    let cdata = cacheData[i];
    if (cacheData[i]) {
      element.size.forEach((elem) => {
        if (cdata[elem.sizeValue] && cdata[elem.sizeValue] != 0) {
          totalUnit = totalUnit + Number(cdata[elem.sizeValue]);
        }
      });
    }
    this.updateTotalUnit(i,totalUnit);
    this.calculateTotalRatioSum();
  }

  updateTotalUnit(i,totalUnit){
    this.inputService.updateInput(this._shared.getRatioPackDetailsPath(i,'totalUnit'),totalUnit);
  }

  calculateTotalRatioSum(){
    this.totalRatioSum = 0;
    let cacheData = this._cache.getCachedValue(this._shared.ratioPackPath );
    if(cacheData){
      cacheData.forEach(ratio=>{
        if(ratio){
          this.totalRatioSum += ratio.totalUnit;
        }
      })
    }
    this.calculateNoOfCarton();
  }

  resetCache() {
    this.servcie.resetInputCacheWithKey(this._shared.solidPackPath);
    this.servcie.resetInputCacheWithKey(this._shared.ratioPackHeaderPath);
    this.servcie.resetInputCacheWithKey(this._shared.ratioPackPath);
  }

  validateQty(model) {
    let flag = false;
    model.color.forEach((elem, index) => {
      elem["size"].forEach((element, index2) => {
        if ( Number(model.noOfCartons) * Number(element.value) > Number(element.orderQty) ) {
          this.inputService.setError("po." + this._shared.id + ".ratioPack" + "[" + index + "]." + element.sizeValue,"Specified quantity is greater than order quantity(" + element.orderQty + ")");
          flag = true;
        }
        // if(Number(element.value) == 0){
        //   this.inputService.setError("po." + this._shared.id + ".ratioPack" + "[" + index + "]." + element.sizeValue,"Ratio should be greater than 0 or empty");
        //   flag = true;
        // }
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
        if (!flag && y.sizeValue != 'Total Units') {
          sizeValue.push([]);
        }
        else if (!flag && y.sizeValue == 'Total Units'){
          sizeValue.push(y);
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
      "solidPack[" + (index) + "]." + key
    );
    if (element) {
      element.focus();
    }
  }

  validateSolidPack(){
    this.dataTable.models.forEach((elem,index)=>{
      if(elem.orderQty != "" && elem.orderQty != null && elem.orderQty != 0){
        if(elem.qntyPerCtn == 0 || elem.qntyPerCtn == ""){
          this.inputService.setError(this._shared.getSolidPackDetailsPath(index,'qntyPerCtn'),"Quantity per carton should be greater than 0")
        }
      }
    })
  }

  calculateNoOfCarton(packQty?,prePack?){
      try{
        let headerData = this._cache.getCachedValue(this._shared.ratioPackHeaderPath)[0];
        packQty = headerData.packQty;
        prePack = headerData.prePack;
        let noOfCtn = Math.ceil(Number(packQty)/(Number(prePack)*Number(this.totalRatioSum)));
        this.inputService.updateInput(this._shared.getRatioPacksHeaderPath(0,'noOfCartons'),noOfCtn ? noOfCtn : '');
        if(Number(packQty) % this.totalRatioSum != 0 ){
          this.inputService.setError(this._shared.getRatioPacksHeaderPath(0,'packQty'),"Pack quantity should be a multiple of sum of ratios (" + this.totalRatioSum + ")")
        }
        else{
          this.inputService.resetError(this._shared.getRatioPacksHeaderPath(0,'packQty'));
        }
        if(Number(packQty) < (Number(this.totalRatioSum) * Number(prePack))){
          this.inputService.setError(this._shared.getRatioPacksHeaderPath(0,'packQty'),"Pack quantity should be greater than 'Pre Pack * Total Units' (" + (Number(this.totalRatioSum) * Number(prePack)) + ")");
        }
      }
      catch(err){
        console.log(err);
      }
  }
    
}
