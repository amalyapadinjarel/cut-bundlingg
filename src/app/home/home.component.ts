import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'app/shared/services';
import { User } from 'app/shared/models';
import { AlertUtilities } from 'app/shared/utils/alert.utility';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  currentUser: User;
  userSubs: Subscription;

  constructor(
    private userService: UserService,
    private alertUtils: AlertUtilities
  ) { }

  ngOnInit() {
    this.userSubs = this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubs)
      this.userSubs.unsubscribe();
  }

  showAlert() {
    var tmp = document.implementation.createHTMLDocument("New").body;
    let html = "this is a <a href='#'>test></a> <b>:)</b>";
    tmp.innerHTML = html;
    this.alertUtils.showAlerts(tmp.textContent || tmp.innerText || "");
  }
}
