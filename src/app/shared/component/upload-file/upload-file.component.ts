
import {takeUntil} from 'rxjs/operators';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ApiServiceV4 } from '../../services/index';
import { AlertUtilities } from 'app/shared/utils/alert.utility';


@Component({
	selector: 'p-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, OnDestroy {

	private ngUnsubscribe: Subject<any> = new Subject<any>();
	multiple = false;
	reader = new FileReader();
	url = '';
	apiClass = '';
	fileFormat = '';
	loading = false;
	@ViewChild('fileInput') inputEl: ElementRef;
	@ViewChild('uploadedImg') image;
	fileUploaded = false;
	constructor(
		private alertUtils: AlertUtilities
		, private dialogRef: MatDialogRef<UploadFileComponent>
		, private apiService: ApiServiceV4
	) {}

	ngOnInit() {
	}
	
	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	upload(): void {
		const inputEl: HTMLInputElement = this.inputEl.nativeElement;
		const fileCount: number = inputEl.files.length;
		const formData = new FormData();
		if (fileCount > 0) {
			this.fileUploaded = true;
			for (let i = 0; i < fileCount; i++) {
				formData.append('file', inputEl.files.item(i));
			}
			this.loading = true;
			this.apiService
				.postMultipart(this.url, formData).pipe(
				takeUntil(this.ngUnsubscribe))
				.subscribe(res => {
					this.loading = false;
					if (res) {
						this.dialogRef.close(res);
					} else {
						this.alertUtils.showAlerts((res && res.responseMessage) ? res.responseMessage : 'Upload operation failed');
					}
				});
		} else {
			this.alertUtils.showAlerts('Failed to upload file');
		}
	}

	fileChanged(): void {
		const inputEl: HTMLInputElement = this.inputEl.nativeElement;
		const fileCount: number = inputEl.files.length;
		if (fileCount > 0) {
			this.fileUploaded = true;
		}
	}

	validate() {
		const inputEl: HTMLInputElement = this.inputEl.nativeElement;
		var _validFileExtensions = [".csv"];
		var oInput = inputEl;
		if (oInput.type == "file") {
			var sFileName = oInput.value;
			if (sFileName.length > 0) {
				var blnValid = false;
				for (var j = 0; j < _validFileExtensions.length; j++) {
					var sCurExtension = _validFileExtensions[j];
					if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
						blnValid = true;
						break;
					}
				}
				if (!blnValid) {
					this.alertUtils.showAlerts("Invalid file format, allowed extension is: " + _validFileExtensions.join(", "));
					return false;
				}
			}
		}
		return true;
	}
}
