import { Directive, HostListener, Input, OnDestroy, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from "rxjs";

import { ApiServiceV4, EventService } from "app/shared/services";
import { CommentsModalComponent } from 'app/shared/component/comments/comments-modal/comments-modal.component';

@Directive({
  selector: '[appComment]'
})
export class CommentDirective implements OnDestroy {
  @Input() objectOwner: "";
  @Input() objectName = "";
  @Input() objectPk;
  @Input() showComment = true;

  commentCount: number = 0;
  commentSubs: Subscription;

  constructor(
    private elemRef: ElementRef,
    private dialog: MatDialog,
    private apiService: ApiServiceV4,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.commentSubs = this.eventService.commentsCountChanged.subscribe(change => {
      if (this.objectOwner + "." + this.objectName + "." + this.objectPk == change.key) {
        this.commentCount += parseInt(change.count);
        this.writeCount();
      }
    })
  }

  ngOnChanges(): void {
    this.setCommentsCount();
  }

  ngOnDestroy(): void {
    if (this.commentSubs)
      this.commentSubs.unsubscribe();
  }

  @HostListener('click') onClick() {
    this.openCommentBox();
  }

  openCommentBox() {
    let dialogRef = this.dialog.open(CommentsModalComponent);
    dialogRef.componentInstance.objectOwner = this.objectOwner;
    dialogRef.componentInstance.objectName = this.objectName;
    dialogRef.componentInstance.objectPk = this.objectPk;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  setCommentsCount() {
    this.apiService.get('/administration/comments?objectPk=' + this.objectPk + '&objectName=' + this.objectName + '&objectOwner=' + this.objectOwner + '&isParent=true&limit=4')
      .subscribe(data => {
        if (data.total) {
          this.commentCount = parseInt(data.total);
        }
        else {
          this.commentCount = 0;
        }
        this.writeCount();
      });
  }

  writeCount() {
    if (this.showComment === true) {
      let elems = this.elemRef.nativeElement.getElementsByClassName('count');
      if (this.commentCount == 0) {
        if (elems.length > 0)
          elems[0].classList = 'count hide';
      }
      else {
        let elem;
        if (elems.length == 0) {
          elem = document.createElement('span');
          this.elemRef.nativeElement.append(elem);
        }
        else
          elem = elems[0];
        elem.classList = "count";
        elem.innerHTML = this.commentCount > 100 ? "100 +" : this.commentCount;
      }
    }
  }
}
