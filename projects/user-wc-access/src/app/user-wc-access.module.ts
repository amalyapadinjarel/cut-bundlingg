
import { NgModule, ModuleWithProviders } from '@angular/core';

import { UserWcAccessRoutingModule } from './user-wc-access-routing.module';
import { UserWcAccessComponent } from './user-wc-access.component';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { UserWcAccessSharedService } from './_services/user-wc-access-shared.service';
import { CommonModule } from '@angular/common';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { UserWcAccessService } from './_services/user-wc-access.service';
import { CopyFromUserComponent } from './copy-from-user/copy-from-user.component';

const PROVIDERS = [UserWcAccessSharedService,UserWcAccessService,TnzInputService,LocalCacheService];
@NgModule({
  declarations: [
    UserWcAccessComponent,
    ListComponent,
    CopyFromUserComponent,
  ],
  imports: [
    UserWcAccessRoutingModule,
    SmdModule,
    CommonModule,
    TnzInputModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [UserWcAccessComponent]
})
export class UserWcAccessModule { 
  static forRoot(): ModuleWithProviders<UserWcAccessModule> {
    return {
      ngModule: UserWcAccessRoutingModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
