import { Component, OnInit } from '@angular/core';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';
import { Subscription } from 'rxjs';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { FacilityLovConfig, ApplicationLovConfig, DivisionLovConfig, TaskFlowLovConfig, ExecutablesLovConfig } from '../../../models/concurrent-programs-lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'concurrent-programs-card',
  templateUrl: './card.component.html',
  host: { 'class': 'header-card' }
})
export class CardComponent implements OnInit {

  loading = true;
	disabled: any = {};
  private refreshSub: Subscription;
  facilityLov = JSON.parse(JSON.stringify(FacilityLovConfig));
  applicationLov = JSON.parse(JSON.stringify(ApplicationLovConfig));
  divisionLov = JSON.parse(JSON.stringify(DivisionLovConfig));
  taskFlowLov = JSON.parse(JSON.stringify(TaskFlowLovConfig));
  executableLov = JSON.parse(JSON.stringify(ExecutablesLovConfig));
  
  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService,
    public dateUtils: DateUtilities,
    private alertUtils: AlertUtilities,
    private inputService: TnzInputService) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this.loadData();
      setTimeout(() => {
        this.setDefaultValues();
      }, 0);
    })
  }

  ngOnDestroy(): void {
   if(this.refreshSub)  
    this.refreshSub.unsubscribe();
  }
    
  loadData() {
    this.setLoading(true);
    this._service.fetchFormData(this._shared.id).then((data: any) => {
      this._shared.setFormHeader(data);
      this.setLoading(false);
    }, err => {
      this.setLoading(false);
      if (err)
        this.alertUtils.showAlerts(err, true)
    });
  }

  setLoading(flag: boolean) {
    this.loading = flag;
    this._shared.headerLoading = flag;
    this._shared.loading = flag;
  }

  disableInput(key) {
    this.disabled[key] = true;
  }

  enableInput(key) {
    this.disabled[key] = false;
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }
  
  valueChanged(event,key?) {
    switch(key){
      case 'form' : {
          if(event.value && event.value.module){
            this.inputService.updateInput(this._shared.getHeaderAttrPath('moduleName'), event.value.module);
            this.inputService.updateInput(this._shared.getHeaderAttrPath('displayActive'), 'Y');
          }
          else{
            this.inputService.updateInput(this._shared.getHeaderAttrPath('moduleName'), "");
          }
          break;
      }

    }
  }

  setDefaultValues() {
		if (this._shared.id == 0) {
			let defaultValues = {
        'reqdParamCount': "0"
			}
			Object.keys(defaultValues).forEach(attr => {
				this.inputService.updateInput(this._shared.getHeaderAttrPath(attr), defaultValues[attr])
			});
		}
	}

}
