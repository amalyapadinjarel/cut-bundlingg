import { Component, OnInit } from '@angular/core';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { Subscription } from 'rxjs';
import { RolesService } from '../../_service/roles.service';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'roles-general-card',
  templateUrl: './general-card.component.html',
  styleUrls: ['./general-card.component.scss'],
 //host: { 'class': 'header-card' }
 host: { 'class': 'general-card' }
})
export class GeneralCardComponent implements OnInit {

  disabled: any = {};

  loading = true;

  private refreshSub: Subscription;
  private refreshHeaderSub: Subscription;


  authorOptions = [{
    label: 'User',
    value: 'U'
  },
  {
    label: 'System',
    value: 'S'
  }];
  dialog: any;

  constructor(
    public _shared: RolesSharedService,
    private _service: RolesService,
    private alertUtils: AlertUtilities,
    private _inputService: TnzInputService,
    private dateUtils: DateUtilities
  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
    //  if(change)
      this.loadData();
      this.setDefaultValues();
    })

    this.refreshHeaderSub = this._shared.refreshHeaderData.subscribe(change => {
  //   if(change)
      this.loadData();
    })

  }

  ngOnDestroy() {
    if (this.refreshSub)
      this.refreshSub.unsubscribe();
    if (this.refreshHeaderSub)
      this.refreshHeaderSub.unsubscribe();

  }

  disableInput(key) {
    this.disabled[key] = true;
  }

  enableInput(key) {
    this.disabled[key] = false;
  }

  valueChangedFromUI(event) {

    // console.log(event)
    // console.log("author=",this._shared.getHeaderAttributeValue('author'));
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }

  valueChanged(event) {

  }

  roleShortCodeValidation(event) {

    let tmp = event.value.toUpperCase();
    let limit = 30;
    if (tmp.length > 30) {
      this._inputService.setError(this._shared.getHeaderAttrPath('roleShortCode'), 'Length exceeded ' + limit + ' characters!');
    }
    else {
    //  check for duplicates
      this._service.duplicateRoleCodeCheck(tmp).then(data => {
        if (data == true) {
          this._inputService.setError(this._shared.getHeaderAttrPath('roleShortCode'), 'Duplicate role code -' + event.value + ' !');
        } else {
          if (/^[A-Z0-9_.]$/.test(event.value))
            this._inputService.setError(this._shared.getHeaderAttrPath('roleShortCode'), 'Please enter a valid role code.');

        }
      });
    }
  }



  loadData() {
    this.setLoading(true);
    this._service.fetchFormData(this._shared.id).then((data: any) => {
      this._shared.setFormHeader(data);
      this.setLoading(false);
    }, err => {
      this.setLoading(false);
      if (err) {
        this.alertUtils.showAlerts(err, true);
      }
    });
  }

  setLoading(flag: boolean) {
    this.loading = flag;
    this._shared.loading = flag;
    this._shared.headerLoading = flag;
  }



  headerLengthCheck(event, attr) {
    let val = event.value;
    let limit;
    switch (attr) {
      case 'description':
        limit = 240;
        break;
      case 'roleName':
          limit = 60;
          break;
     
    }
    if (val != null && val != "" && val != " ")
      if (val.length > limit) {
        this._inputService.setError(this._shared.getHeaderAttrPath(attr), 'Length exceeded ' + limit + ' characters!');
      }
  }
  setDefaultValues() {
    if (this._shared.id == 0) {
      let defaultValues = {
        'startDate': DateUtilities.formatDate(new Date()),
        'author':'U'
      }
      Object.keys(defaultValues).forEach(attr => {
        this._inputService.updateInput(this._shared.getHeaderAttrPath(attr), defaultValues[attr])
      });

    }
    
  }

}
