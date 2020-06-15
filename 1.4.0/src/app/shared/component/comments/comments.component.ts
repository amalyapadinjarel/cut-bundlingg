
import {map, catchError} from 'rxjs/operators';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { ApiServiceV4 } from 'app/shared/services';
import { EventService } from "app/shared/services";
import { Subscription } from 'rxjs';
import { AlertUtilities } from 'app/shared/utils/alert.utility';


@Component({
	selector: 'app-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnChanges, OnDestroy {
	@Input() objectOwner;
	@Input() objectName;
	@Input() objectPk;
	@Input() isModel = false;
	@Input() height = 0;

	totalComments: any;
	edited: any = [];
	fullDataFetched: boolean = false;
	showRichText: boolean = false;
	olderCount: number;
	commentValue: any = [];
	commentId: any;
	commentLength: any;
	currentUserId: any;
	comments: any;
	expand = [];
	formGroup: FormGroup;
	enableTextArea = [false];
	currentUser = [];
	enteredData;
	editedData = [];
	public options: Object;
	commentSubs: Subscription;

	constructor(
		private apiService: ApiServiceV4,
		private alertUtils: AlertUtilities,
		private eventService: EventService,
	) {
		this.options = {
			quickInsert: false,
			toolbarInline: true,
			placeholderText: 'Write a comment... ',
			quickInsertButtons: [],
			quickInsertTags: [''],
			toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'emoticons', 'subscript', 'superscript', '|',
				'fontFamily', 'fontSize', 'color', 'paragraphFormat', '|',
				, 'align', 'formatOL', 'formatUL', 'quote', 'clearFormatting', '|',
				'insertLink', 'insertTable', '|',
				'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
				'spellChecker', 'help', 'html', '|', 'undo', 'redo']
		}

		this.commentSubs = this.eventService.commentsChanged.subscribe(change => {
			if (this.objectOwner + "." + this.objectName + "." + this.objectPk == change.key) {
				this.refresh();
			}
		})
	}

	ngOnChanges() {
		this.getComments(true);
	}
	
	ngOnDestroy(): void {
		if (this.commentSubs)
			this.commentSubs.unsubscribe();
	}

	getComments(isCreate) {
		this.apiService.get('/administration/comments?objectPk=' + this.objectPk + '&objectName=' + this.objectName + '&objectOwner=' + this.objectOwner + '&isParent=true&limit=4')
			.subscribe(data => {
				this.setFormData(data.tnzComments, isCreate);
				this.olderCount = data.total - data.count;
				this.totalComments = data.total;
				if (data.total == data.count)
					this.fullDataFetched = true;
			});
	}

	setFormData(comments, isCreate) {
		this.comments = comments.reverse();
		this.commentLength = comments.length;
		this.getUserDetails(comments, isCreate);
	}

	editRecord(event, selectedItem, i) {
		event.stopPropagation();
		event.preventDefault();
		this.enableTextArea[i] = true;
		this.expand[i] = true;
		this.editedData[i] = selectedItem.commentFullText;
		this.commentId = selectedItem.commentId;
	}

	getUserDetails(comments, isCreate) {
		this.apiService.get('/user')
			.subscribe(data => {
				this.currentUserId = data.user.userId;
				for (let index = 0; index < comments.length; index++) {
					if (isCreate) {
						this.expand[index] = true;
						this.enableTextArea[index] = false;
					}
					if (comments[index].revision > 1)
						this.edited[index] = true;
					else
						this.edited[index] = false;
					if (comments[index].userId == this.currentUserId)
						this.currentUser[index] = true;
				}
			});
	}

	postComment() {
		let tnzComments = {
			commentType: "C",
			objectOwner: this.objectOwner,
			objectName: this.objectName,
			objectPk: this.objectPk.toString(),
			commentFullText: this.enteredData,
			destinationUrl: ""
		}
		this.postCallToAPI(tnzComments).pipe(
			catchError((err) => {
				this.formGroup.enable();
				return err;
			}))
			.subscribe(data => {
				if (data.status === 'S') {
					this.eventService.commentsCountChanged.next({ key: this.objectOwner + "." + this.objectName + "." + this.objectPk, count: 1 });
					this.eventService.commentsChanged.next({ key: this.objectOwner + "." + this.objectName + "." + this.objectPk});
					this.enteredData = '';
				}
				else
					this.alertUtils.showAlerts("Error posting comment");
			});
	}
	postCallToAPI(tnzComments) {
		return this.apiService.post('/administration/comments', { tnzComments: tnzComments }).pipe(
			map(data => { return data }));
	}

	putComment(i) {
		let tnzComments = {
			commentType: "C",
			objectOwner: this.objectOwner,
			objectName: this.objectName,
			objectPk: this.objectPk.toString(),
			commentFullText: this.editedData[i],
			destinationUrl: "",
			commentId: this.commentId,
		}
		this.putCallToApi(tnzComments).pipe(
			catchError((err) => {
				this.formGroup.enable();
				return err;
			}))
			.subscribe(data => {
				if (data.status === 'S') {
					this.enableTextArea[i] = false;
					this.expand[i] = true;
					this.eventService.commentsChanged.next({ key: this.objectOwner + "." + this.objectName + "." + this.objectPk });
				}
				else
					this.alertUtils.showAlerts("Error editing comment");
			});
	}

	putCallToApi(tnzComments) {
		return this.apiService.put('/administration/comments', { tnzComments: tnzComments }).pipe(
			map(data => { return data }));
	}

	deleteRecord(event, selectedItem) {
		event.stopPropagation();
		event.preventDefault();
		this.deleteComment(selectedItem.commentId)
			.subscribe(() => {
				this.eventService.commentsCountChanged.next({ key: this.objectOwner + "." + this.objectName + "." + this.objectPk, count: -1 });
				this.eventService.commentsChanged.next({ key: this.objectOwner + "." + this.objectName + "." + this.objectPk });
			});
	}

	deleteComment(commentId) {
		return this.apiService.delete('/administration/comments/' + commentId).pipe(
			map(data => { return data }));
	}

	showMore(event?) {
		if (event)
			event.preventDefault();
		this.apiService.get('/administration/comments?objectPk=' + this.objectPk + '&objectName=' + this.objectName + '&objectOwner=' + this.objectOwner + '&isParent=true&limit=0')
			.subscribe(data => {
				this.totalComments = data.total;
				this.setFormData(data.tnzComments, true);
				this.fullDataFetched = true;
			});
	}

	expansionPanel(val, index) {
		if (val == true) {
			this.commentValue[index] = '';
			this.expand[index] = true;
		}
		else {
			this.commentValue[index] = this.comments[index].commentFullText;
			this.expand[index] = false;
		}
	}

	controlHere(textAreaControl) {
		textAreaControl.focus();
	}

	mouseEvent2(event, textAreaForInput) {
		if (event.type == 'mouseover')
			textAreaForInput.focus();
	}

	refresh() {
		if (this.fullDataFetched)
			this.showMore();
		else
			this.getComments(false);
	}

	checkForEnter(evt) {
		if (evt.keyCode === 13) {
			this.postComment();
		}
	}
}
