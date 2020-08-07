import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { Router, ActivatedRoute, ResolveEnd, NavigationEnd } from '@angular/router';
import { DocSequenceSharedService } from '../_service/doc-sequence-shared.service';
import { DocSequenceService } from '../_service/doc-sequence.service';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit {
  private subs = new SubSink();
  constructor(private router: Router,
    public _shared: DocSequenceSharedService,
    public _service: DocSequenceService,
    private route: ActivatedRoute,
    private alertUtils: AlertUtilities,
    public dateUtils: DateUtilities,
    private _inputService: TnzInputService) { }

  ngOnInit(): void {
    this.setDocSeq();
   
    this.subs.sink = this.router.events.subscribe(change => {
      this.routerChanged(change);
 this.setDefaultValues() 
    })

    
   
  }
  ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
  setDocSeq() {
    if (this.router.url.endsWith('/create')) {
      this._shared.id = 0;
      this._shared.editMode = true;
    }
    else {
      this._shared.id = this.route.snapshot.params.docSeqId;
      if (this.router.url.endsWith('/edit')) {
        this._shared.editMode = true;
      }
      else {
        this._shared.editMode = false;
        this._shared.refreshData.next(true);
      }
    }
    this._shared.setFormData({});
    this._shared.resetAll();

  }

  routerChanged(change) {
    if (change instanceof ResolveEnd) {
      if (change.url.startsWith('/doc-sequence/list')) {
        this.unsetDocSeq();
      }
    }
    if (change instanceof NavigationEnd) {
      this.setDocSeq();
    }
  }

  

  unsetDocSeq() {
    this._shared.editMode = false;
    this._shared.id = 0;
    this._shared.setFormData({});
  }

 
  deleteLines(key){
this._service.deleteLines(key)

  }
  setDefaultValues(){
	
	
	   this._shared.resetyearFlag = false
		this._shared.customFlag = false
		this._shared.notresetyearFlag = false
	   
	
}
}