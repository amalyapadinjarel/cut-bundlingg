import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSharedService } from '../../_service/user-shared.service';
import { Subscription } from 'rxjs';
import { PersonnelNumLOVConfig, CountryCodeLOVConfig } from '../../models/lov-config';
import { UserAppService } from '../../_service/user.service';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { User } from '../../models/user';

@Component({
  selector: 'user-general-card',
  templateUrl: './general-card.component.html',
  styleUrls: ['./general-card.component.scss'],
  host: { 'class': 'general-card' }
})

export class GeneralCardComponent implements OnInit, OnDestroy {

  disabled: any = {};

  loading = true;

  private refreshSub: Subscription;
  private refreshHeaderSub: Subscription;

  personnelNumLOV = JSON.parse(JSON.stringify(PersonnelNumLOVConfig));
  countryCodeLOV = JSON.parse(JSON.stringify(CountryCodeLOVConfig))
  countryCodeOptions = [];
  dialog: any;

  constructor(
    public _shared: UserSharedService,
    private _service: UserAppService,
    private alertUtils: AlertUtilities,
    private _inputService: TnzInputService,
    private dateUtils: DateUtilities
  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this.loadData();
      this.setDefaultValues();
    })

    this.refreshHeaderSub = this._shared.refreshHeaderData.subscribe(change => {
      this.loadData();
    })

  }

  ngOnDestroy() {
    if (this.refreshSub)
      this.refreshSub.unsubscribe();
    if (this.refreshHeaderSub)
      this.refreshHeaderSub.unsubscribe();

    //  this._service.apiSubscription?.unsubscribe();

  }

  disableInput(key) {
    this.disabled[key] = true;
  }

  enableInput(key) {
    this.disabled[key] = false;
  }

  valueChangedFromUI(event) {

  }

  getIfEditable(key) {
    //console.log("edit=",this._shared.getHeaderEditable(key, this._shared.id))
    if ((key == 'attemptsLeft') && this._shared.getHeaderEditable(key, this._shared.id)) {

      let val = this._inputService.getInputValue(this._shared.getHeaderAttrPath(key));
      if (val == 0) {
        return this._shared.getHeaderEditable(key, this._shared.id);
      }
      else {
        return false;
      }
    } else
      return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }

  valueChanged(event) {

  }

  userNameValidation(event) {

    let tmp = event.value.toUpperCase();
    let limit = 100;
    if (tmp.length > 100) {
      this._inputService.setError(this._shared.getHeaderAttrPath('userName'), 'Length exceeded ' + limit + ' characters!');
    }
    else {
      //check for duplicates
      this._service.duplicateUserNameCheck(tmp).then(data => {
        if (data == true) {
          this._inputService.setError(this._shared.getHeaderAttrPath('userName'), 'Duplicate user name -' + event.value + ' !');
        } else {
          if (/^[A-Z0-9_.]$/.test(event.value))
            this._inputService.setError(this._shared.getHeaderAttrPath('userName'), 'Please enter a valid username.');

        }
      });
    }
  }

  personnelNumValidation(event) {
    let val = event.value;
    this._service.duplicatePersonnelCheck(val).then(data => {
      if (data == true) {
        this._inputService.setError(this._shared.getHeaderAttrPath('personnelNum'), 'Personnel Num -' + val.personnelNum + ' already exists !');
      } else {

        this._inputService.updateInput(this._shared.getHeaderAttrPath('firstName'), val.firstName);
        this._inputService.updateInput(this._shared.getHeaderAttrPath('middleName'), val.middleName);
        this._inputService.updateInput(this._shared.getHeaderAttrPath('lastName'), val.lastName);
        this._inputService.updateInput(this._shared.getHeaderAttrPath('knownAs'), val.knownAs);


      }
    });
    //this._shared.refreshData.next(true);
  }

  emailValidation(event) {
    if (!(/^(.+)@(.+)$/.test(event.value)))
      this._inputService.setError(this._shared.getHeaderAttrPath('emailAddress'), 'Please enter a valid email address.');

  }

  // passwordValidation(event, attr) {
  //   let val=event.value;
  //   console.log("val=",val)

  //   switch(attr){

  //     case 'password':{
  //       let conf=this._shared.getHeaderAttributeValue('confirmPassword');
  //       if(conf=="") console.log("true")
  //       break;
  //     }
  //     case 'confirmPassword':{
  //       let pass=this._shared.getHeaderAttributeValue('password');
  //       if(pass=="")console.log("true")
  //       break;
  //     }
  //   }

  // }


  passwordValidation(event, attr) {
    let val = event.value;
   // console.log("val=,",val)

    this._inputService.resetError(this._shared.getHeaderAttrPath('confirmPassword'));

    let pass = this._shared.getHeaderAttributeValue('password');
    let conf = this._shared.getHeaderAttributeValue('confirmPassword');
    if (pass == "")
    this._inputService.setError(this._shared.getHeaderAttrPath('password'), 'Please enter password.');
    else if (pass != conf)
    {
      this._inputService.setError(this._shared.getHeaderAttrPath(attr), 'Passwords not matching.');
    }
   
   }


  confirmPasswordValidation(event, attr) {
    let val = event.value;
 
    //console.log("val=,",val)
    this._inputService.resetError(this._shared.getHeaderAttrPath('password'));

    let pass = this._shared.getHeaderAttributeValue('password');
    let conf = this._shared.getHeaderAttributeValue('confirmPassword');
    if (conf == "")
    this._inputService.setError(this._shared.getHeaderAttrPath('confirmPassword'), 'Please confirm password.');
    else if (pass != conf)
    {
      this._inputService.setError(this._shared.getHeaderAttrPath(attr), 'Passwords not matching.');
    }


  }

  PhoneNumberValidation(event) {
    var reg = /^\d+$/;
    if (!reg.test(event.value))
      this._inputService.setError(this._shared.getHeaderAttrPath('phoneNumber'), 'Please enter a valid phone number (Only numbers allowed)!');
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
  copyFromPerson(event) {
    let tmp = event.value;
    this._inputService.updateInput(this._shared.getHeaderAttrPath('firstName'), tmp.firstName);
    this._inputService.updateInput(this._shared.getHeaderAttrPath('middleName'), tmp.middleName);
    this._inputService.updateInput(this._shared.getHeaderAttrPath('lastName'), tmp.lastName);
    this._inputService.updateInput(this._shared.getHeaderAttrPath('knownAs'), tmp.knownAs);

  }
  maxAttempts(event) {
    let tmp = event.value;
    if (tmp > 3) {
      this._inputService.setError(this._shared.getHeaderAttrPath('maxAttempts'), 'Please enter value less than 4')
    }
  }

  headerLengthCheck(event, attr) {
    let val = event.value;
    let limit;
    switch (attr) {
      case 'description':
        limit = 240;
        break;
      case 'knownAs':
        limit = 160;
        break;
      default:
        limit = 150;
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
        'attemptsLeft': 3
      }
      Object.keys(defaultValues).forEach(attr => {
        this._inputService.updateInput(this._shared.getHeaderAttrPath(attr), defaultValues[attr])
      });

    }
  }

  // lengthCheck(event, index, attr) {
  //   let val = event.value;
  //   let limit;

  //   //update TO DO
  //   switch (attr) {
  //     case 'lookupCode':
  //       limit = 30;
  //       break;
  //     case 'meaning':
  //       limit = 80;
  //       break;
  //     case 'header1': case 'header2': case 'header3': case 'header4': case 'header5':
  //       limit = 60;
  //       break;
  //     case 'description':
  //       limit = 240;
  //       break;
  //     default:
  //       limit = 150;
  //       break;
  //   }

  //   if (val.length > limit) {
  //     //	this._inputService.setError(this._shared.getLookupValuePath(index,attr), 'Length exceeded ' + limit + ' characters!');
  //   }
  // }
}
