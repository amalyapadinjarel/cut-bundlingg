import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { EventService, LocalConfigService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils/alert.utility';

@Component({
	selector: 'trendz-file-preview',
	templateUrl: './file-preview.component.html',
	styleUrls: ['./file-preview.component.scss']
})
export class TrendzFilePreviewComponent implements OnInit, OnDestroy {

	file: any;
	files: any[] = [];
	previewType;
	previewReady = false;
	fileDataType;
	fileData;
	fileUrl;
	hasNext = false;
	hasPrev = false;
	fileProviderService;
	scheduler = false;
	alwaysRunBackground = false;
	runPreviewinBackGround:boolean;

	@ViewChild('printWindow') printWindow: ElementRef;

	onPushMessage: Subscription;

	constructor(
		private elementRef: ElementRef,
		private dialogRef: MatDialogRef<TrendzFilePreviewComponent>,
		private alertUtils: AlertUtilities,
		private sanitizer: DomSanitizer,
		private eventService: EventService,
		private localConfig: LocalConfigService
	) {
	}

	ngOnInit() {
		this.runPreviewinBackGround = this.localConfig.isReportPreviewInBackground()
		this.localConfig.runReportPreviewInBackground(true);
		this.elementRef.nativeElement.parentElement.style.background = "transparent";
		this.elementRef.nativeElement.parentElement.style.boxShadow = "none";
		this.elementRef.nativeElement.parentElement.style.position = "absolute";
		this.elementRef.nativeElement.parentElement.style.top = "0px";
		this.elementRef.nativeElement.parentElement.style.left = "0px";
		this.elementRef.nativeElement.parentElement.style.width = "100%";
		this.elementRef.nativeElement.parentElement.style.height = "100%";
		this.onPushMessage =
			this.eventService.schedulerJobChnaged
				.subscribe(change => {
					if (change.job && this.file && this.file.key == change.job.instanceId) {
						if (change.job.jobState == 'C' && change.job.jobStatus == 'S') {
							if (this.fileProviderService)
								this.loadPreview();
						}
						this.scheduler = false;
					}
				});
		if (!this.scheduler && this.fileProviderService)
			this.loadPreview();
	}

	ngOnDestroy() {
		if (this.onPushMessage) {
			this.onPushMessage.unsubscribe();
		}
		this.localConfig.runReportPreviewInBackground(this.runPreviewinBackGround);		
	}

	loadPreview() {
		this.previewType = '';
		this.previewReady = false;
		if (this.file.contentType.startsWith('image/'))
			this.previewType = "image";
		else if (this.file.contentType.endsWith('/pdf'))
			this.previewType = "pdf";
		this.fileProviderService.getPreviewContent(this.file.key).then(content => {
			this.fileDataType = content.type;
			this.fileData = content.data;
			if (this.fileDataType == 'base64') {
				if (this.previewType == "image")
					this.fileUrl = this.sanitizer.bypassSecurityTrustUrl('data:' + this.file.contentType + ';base64,' + this.fileData);
				else if (this.previewType == "pdf")
					this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.file.contentType + ';base64,' + this.fileData);
				this.previewReady = true;
			}
			else if (this.fileDataType == 'url') {
				if (this.previewType == "image")
					this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(this.fileData);
				else if (this.previewType == "pdf")
					this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileData);
				this.previewReady = true;
			}
		}, err => {
			this.alertUtils.showAlerts("Failed to load preview");
		});
		let index = this.files.indexOf(this.file);
		if (index + 1 < this.files.length)
			this.hasNext = true;
		else
			this.hasNext = false;
		if (index > 0)
			this.hasPrev = true;
		else
			this.hasPrev = false;
	}

	printFile() {
		const element = this.printWindow.nativeElement;
		if (this.previewType == "pdf") {
			if (this.fileDataType == 'base64') {
				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data);

					const byteArrays = [];

					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize),
							byteNumbers = new Array(slice.length);
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i);
						}
						const byteArray = new Uint8Array(byteNumbers);

						byteArrays.push(byteArray);
					}

					const blob = new Blob(byteArrays, { type: contentType });
					return blob;
				}
				const blob = b64toBlob(this.fileData, this.file.contentType);
				element.setAttribute('src', URL.createObjectURL(blob));
			}
			else if (this.fileDataType == 'url') {
				element.setAttribute('src', this.fileData);
			}
			setTimeout(() => {
				element.contentWindow.print();
			}, 500);

		}
		else if (this.previewType == "image") {
			element.contentWindow.document.open();
			if (this.fileDataType == 'base64') {
				element.contentWindow.document.write(`<html><body style="text-align: center;"><img style="max-width:100%; max-height:100%;" src="data:` + this.file.contentType + `;base64,` + this.fileData + `" /></body></html>`);
			}
			else if (this.fileDataType == 'url') {
				element.contentWindow.document.write(`<html><body style="text-align: center;"><img style="max-width:100%; max-height:100%;" src="` + this.fileData + `" /></body></html>`);
			}
			setTimeout(() => {
				element.contentWindow.print();
				element.contentWindow.document.close();
			}, 500);
		}
	}

	downloadFile() {
		const element = document.createElement('a');
		if (this.fileDataType == 'base64') {
			element.setAttribute('href', 'data:' + this.file.contentType + ';base64,' + encodeURIComponent(this.fileData));
		}
		else if (this.fileDataType == 'url') {
			element.setAttribute('href', this.fileProviderService.getDownloadUrl(this.file.key));
		}
		element.setAttribute('target', '_blank');
		element.setAttribute('download', this.file.name);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	closeOnClick(event) {
		if (event.target.className == "content-wrap")
			this.dialogRef.close();
	}

	next() {
		let index = this.files.findIndex(item => {
			return item.key == this.file.key;
		});
		if (index + 1 < this.files.length) {
			this.file = this.files[index + 1]
			this.loadPreview();
		}
	}

	prev() {
		let index = this.files.findIndex(item => {
			return item.key == this.file.key;
		});
		if (index > 0) {
			this.file = this.files[index - 1]
			this.loadPreview();
		}
	}

	runInBackground() {
		if (this.alwaysRunBackground === true) {
			this.localConfig.runReportPreviewInBackground();
			this.runPreviewinBackGround = true;
		}
		this.dialogRef.close();
	}

}
