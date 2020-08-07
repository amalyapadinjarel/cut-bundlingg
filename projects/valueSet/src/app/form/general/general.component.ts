import { Component, OnInit } from '@angular/core';
import { ValueSetSharedService } from '../../services/valueSet-shared.service';
import { DivisionLovConfig, CopyFromFacilityLovConfig } from '../../model/lov.config';
import { FacilityLovConfig } from '../../../../../CutRegister/src/app/models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { ValueSet } from '../../model/valueSet.model';
import { ValueSetService } from '../../services/valueSet.service';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  host: { 'class': 'general-card' }
})
export class GeneralComponent implements OnInit {
  disabled: any = {};
  lovConfigDiv: any = {};
  divisionLov = JSON.parse(JSON.stringify(DivisionLovConfig));
  facilityLov = JSON.parse(JSON.stringify(FacilityLovConfig));
// lovConfig = JSON.parse(JSON.stringify(CopyFromFacilityLovConfig));
  constructor(public _shared: ValueSetSharedService,
	public service: ValueSetService,
	private _inputService: TnzInputService,
	public dialog: MatDialog,) { }

	
  ListTypeOptions = [
		{
			label: 'Choice',
			value: 'C'
		},
		{
			label: 'List of values',
			value: 'L'
    },
    {
			label: 'None',
			value: 'N'
		}
  ];
  DataTypeOptions = [
		{
			//label: 'Number',
			value: 'Number'
		},
		{
			//label: 'Character',
			value: 'Character'
    },
    {
			//label: 'Date',
			value: 'Date'
		}
  ];
  ValidationTypeOptions = [
		{
			label: 'Static',
			value: 'S'
		},
		{
			label: 'Table',
			value: 'T'
    },
    {
			label: 'Query based',
			value: 'Q'
		}
  ];
  AuthorOptions = [
		{
			label: 'User',
			value: 'U'
		},
		{
			label: 'System',
			value: 'S'
    }
   
	];
  ngOnInit(): void {
	this._shared.validationType='N';
	// this._inputService.updateInput(this._shared.getHeaderAttrPath('validationType'),'T');
	if(this._shared.editMode){
		this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');

	}
	
  }
  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.valueSet);
  }
  valueChangedFromUI(event) {
	// if(!this._shared.save){
    let tmp = event.value.toUpperCase();
    
    this._shared.formData.header.shortCode = tmp;
     
     if (tmp.length > 30) {
       this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Length exceeded 30 characters!');
     }
	
	this.service.duplicateValueSetCheck(tmp).then(data => {
        if (data) {
          this._inputService.setError(event.path, 'Duplicate operation short code -' + tmp + ' !');
        }
      }).catch(err => {
      });
	// }
   }
   valueChangedFromValidationType(change){
	

	   if(change.value=='Q'){
		this._shared.validationType='Q';

	   }
	   else if(change.value=='S'){
		this._shared.validationType='S';
	
	   }
	   else if(change.value=='T'){
		this._shared.validationType='T';
	
	   }
   }
   valueChangedFromDivision(event){
  
	
	if(!this._shared.save){
	this.lovConfigDiv=  event.value.value;  
	let divisionParam = `?facilityFromDivision=${event.value.value}`;
	let facilityUrl = 'lovs/facility';
	let newUrl = facilityUrl + divisionParam
	this.facilityLov = {...this.facilityLov, url: newUrl};
	this._inputService.updateInput(this._shared.getHeaderAttrPath('facility'),'');
	
	//c
	// const dialogRef = this.dialog.open(TnzInputLOVComponent);
    // dialogRef.componentInstance.lovConfig = lovConfig;
	}	
   }
   valueChangedFromFacility(event){
    // let lovConfig: any = {};
    
	// this.lovConfig.url += this.lovConfigDiv;  
	// console.log('lovConfig.url---'+this.lovConfig.url);
	// const dialogRef = this.dialog.open(TnzInputLOVComponent);
	// dialogRef.componentInstance.lovConfig = this.lovConfig;
	// console.log('lovConfig---')
	// dialogRef.afterClosed().subscribe(resArray => {
	// 	console.log('subscribe----',resArray)
	// 	if (resArray ) {
	// 		resArray = this.mapResToRolesOrgAccess(resArray);
	// 	}
	//   })
	
   }

   valueChangedFromDataType(event){

  
  if(event.value=='Number'){
  this._shared.dateType='N';
   }else if(event.value=='Character'){
	this._shared.dateType='C';
	 }
	 else if(event.value=='Date'){
		this._shared.dateType='D';
		 }
		}

}
