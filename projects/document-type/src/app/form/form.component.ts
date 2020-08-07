import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd, ResolveEnd } from '@angular/router';
import { DocumentTypeService } from '../_service/document-type.service';
import { DocumentTypeSharedService } from '../_service/document-type-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertUtilities ,DateUtilities } from 'app/shared/utils';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }
  
})
export class DocTypeFormComponent {
  private subs = new SubSink();
 // public clicked = false;
  private loading: boolean;

  constructor(
    private _service: DocumentTypeService,
    public _shared: DocumentTypeSharedService,
    private _inputService: TnzInputService,
    private route: ActivatedRoute,
    private router: Router,
	private dialog: MatDialog,
	private alertUtils: AlertUtilities,
	public dateUtils:DateUtilities
    ) {  

    }

  ngOnInit(){
	
    this.setDocType();
	this.subs.sink = this.router.events.subscribe(change => {
			this.routerChanged(change);		
		})

		this.subs.sink =this._shared.refreshData.subscribe(change => {
			this.loadData();
			if(this._shared.id==0)
			this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
        })
  }
  ngOnDestroy(): void {
		this.subs.unsubscribe();
	}


	setDocType() {
		if (this.router.url.endsWith('/create')) {
			this._shared.id = 0;
			this._shared.editMode = true;
		
		}
		else {

			this._shared.id = this.route.snapshot.params.docTypeId;

			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
			//this._shared.id = this.route.snapshot.params.docTypeId;
	
		}
		
		
		this._shared.setFormData({});

		this._shared.resetAll();
		 this._inputService.resetInputService(this._shared.appKey);
  }
  routerChanged(change) {
		if (change instanceof ResolveEnd) {
			if (change.url.startsWith('/document-type/list')) {
				this.unsetDocType();
			}
		}
		if (change instanceof NavigationEnd) {
			this.setDocType();
		}
	}
  unsetDocType() {
		this._shared.editMode = false;
		this._shared.id = 0;
		this._shared.setFormData({});
	
  }

  loadData() {
	this.setLoading(true);
	this._service.fetchFormData(this._shared.id).then((data: any) => {
		this._shared.setFormHeader(data);
	
		this.setLoading(false);
	}, err => {
		this._shared.setFormHeader({});

		this.setLoading(false);
		if (err)
			this.alertUtils.showAlerts(err, true)
	});

}

setLoading(flag: boolean) {
	this.loading = flag;
	this._shared.headerLoading = flag;
	this._shared.loading = flag;
	this._shared. RoledetailLoading = flag
	this._shared.StatusDetailLoading = flag
}
  
  
	


}
export const CopystatusLovConfig: any = {
	title: 'Select Status',
	url: 'lovs/doc-status',
	dataHeader: 'data',
	returnKey: 'value',
	filterAttributes: ['label'],
	displayFields: [
	  {
		key: 'label',
		title: 'Name'
    },
    {
      key: 'value',
      title: 'Short Code'
      }
  ]
  ,
  allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['value']
  };
  export function CopyRolesLovConfig(id){
	let json ={
    title: 'Select Role',
    url: 'document-type/rolesUnderStatusLov?docTypeId=' + id,
    dataHeader: 'data',
    returnKey: 'value',
    
    filterAttributes: ['label'],
    displayFields: [
      {
      key: 'shortCode',
      title: 'Short Code'
      }
      , {
          key: 'label',
          title: 'Name'
	  }]
	  ,
	  allowMultiple: true,
		preFetchPages: 10,
		primaryKey: ['shortCode']
	}
		return json
	
	}

