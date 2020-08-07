import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services';
import { EventService, JwtService } from 'app/shared/services';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { appVersion } from "environments/environment";
import { User } from 'app/shared/models';
@Component({
  selector: 'app-auth-pop-up',
  templateUrl: './auth-pop-up.component.html',
  styleUrls: ['./auth-pop-up.component.scss']
})
export class AuthPopUpComponent implements OnInit {
  time = 3;
  version = appVersion;
  constructor(private userService: UserService,
    private eventService: EventService,
    private jwtService: JwtService,
    private router: Router,
    public dialogRef: MatDialogRef<AuthPopUpComponent>) { }

  ngOnInit() {

    let counter = setInterval(() => {
      this.time--;
    }, 1000)

    setTimeout(() => {
      clearInterval(counter);
      this.eventService.showGadget.next(false);
      this.eventService.onLogout.next(true);
      this.jwtService.destroyToken();
      this.userService.currentUserSubject.next(new User());
      this.userService.isAuthenticatedSubject.next(false);
      this.userService.authenticated = false;
      this.dialogRef.close();
      this.router.navigateByUrl('/login');
    }, 2000);
  }

}
