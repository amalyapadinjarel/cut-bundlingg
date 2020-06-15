import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './_services/no-auth-guard.service';
import { AuthPopUpComponent } from './auth-pop-up/auth-pop-up.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordCheckerModule } from 'app/shared/component/password-checker/password-checker.module';
import { UserService, ApiService, JwtService, EventService, NavigationService } from 'app/shared/services';
import { HttpClientModule } from '@angular/common/http';
import { AlertUtilities } from 'app/shared/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './_services/auth.service';



const MATERIAL_MODULE = [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule
];
const PROVIDERS = [
  NoAuthGuard,
  UserService,
  ApiService,
  JwtService,
  EventService,
  NavigationService,
  AlertUtilities,
  AuthService
]

const authRouting: ModuleWithProviders = RouterModule.forRoot([
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  }
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MATERIAL_MODULE,
    RouterModule,
    HttpClientModule,
    authRouting,
    PasswordCheckerModule
  ],
  declarations: [
    AuthComponent,
    AuthPopUpComponent,
  ],
  entryComponents: [AuthPopUpComponent],
  providers: [
    PROVIDERS
  ],
  bootstrap: [AuthComponent]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
