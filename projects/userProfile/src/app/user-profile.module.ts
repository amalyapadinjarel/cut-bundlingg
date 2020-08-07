import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ApiServiceV4, EventService, AuthGuard, UserService, JwtService, LocalCacheService } from 'app/shared/services';

import { HttpClientModule } from '@angular/common/http';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { PipesModule } from 'app/shared/pipes/pipes.module';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { UserProfileComponent } from './user-profile.component';
import { UserProfileSharedService } from './_service/user-profile-shared.service';
import { UserProfileService } from './_service/user-profile.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ImageDirectiveModule } from 'app/shared/directives/modules/image-directive.module';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CropCircleComponent } from './crop-circle-component/crop-circle-component.component';

import { LyIconModule } from '@alyle/ui/icon';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { FormComponent } from './form/form.component';
import { GeneralCardComponent } from './form/general-card/general-card.component';
import { PersonalDetailsComponent } from './form/personal-details/personal-details.component';
import { ChangePasswordComponent } from './form/change-password/change-password.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PasswordCheckerModule } from 'app/shared/component/password-checker/password-checker.module';

const MATERIAL_MODULE = [
	  MatIconModule
	, MatCardModule
	, MatTooltipModule
	, MatFormFieldModule
	, MatInputModule
	, MatMenuModule
	, MatDialogModule
	, MatSnackBarModule
	, MatButtonModule
	, MatCheckboxModule
	, MatTabsModule
];
const PROVIDERS = [
	ApiServiceV4,
	EventService,
	JwtService,
	AlertUtilities,
	DateUtilities,
	LocalCacheService,
	UserProfileService,
	UserProfileSharedService,
	TnzInputService
	
]

const userProfileRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: '',
		 //canActivate: [AuthGuard],
		component: UserProfileComponent
		// ,
		// children: [
		// 	{
		// 		path: 'userId',
		// 		component: FormComponent,
		// 	},
		// 	{
		// 		path: 'userId/edit',
		// 		component: FormComponent,
		// 	},
		// 	{
		// 		path: '*',
		// 		component: FormComponent,

		// 	}
			
		// ]
	}
]);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MATERIAL_MODULE,
		userProfileRouting,
		PerfectScrollbarModule,
		HttpClientModule,
		PipesModule,
		ImageDirectiveModule,
		TnzInputModule,
		CommonModule,
		FormsModule,
		LyImageCropperModule,
		LySliderModule,
		LyButtonModule,
		LyIconModule,
		PasswordCheckerModule
	],
	declarations: [
		UserProfileComponent,
		CropCircleComponent,
		FormComponent,
		GeneralCardComponent,
		PersonalDetailsComponent,
		ChangePasswordComponent
	],
	providers: [
		PROVIDERS
	],
	bootstrap: [UserProfileComponent]
})
export class UserProfileModule {
	static forRoot(): ModuleWithProviders<UserProfileModule> {
		return {
			ngModule: UserProfileModule,
			providers: [
				PROVIDERS
			]
		}
	}
}
