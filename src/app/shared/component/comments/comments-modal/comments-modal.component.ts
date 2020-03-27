import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'comments-modal',
	templateUrl: './comments-modal.component.html',
	styleUrls: ['./comments-modal.component.scss']
})
export class CommentsModalComponent implements OnInit, OnDestroy {

	objectOwner;
	objectName;
	objectPk;

	constructor(
		private dialogRef: MatDialogRef<CommentsModalComponent>
	) {
	}
	
	ngOnInit(): void {
	}

	ngOnDestroy() {
		
	}

	close() {
		this.dialogRef.close();
	}

}
