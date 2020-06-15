import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MfgRoutingFormComponent} from './components/mfg-routing-form/mfg-routing-form.component';
import {MfgRoutingListComponent} from './components/mfg-routing-list/mfg-routing-list.component';
import {MfgRoutingComponent} from './mfg-routing.component';


const routes: Routes = [{
    path: '',
    component: MfgRoutingComponent,
    children: [
        {
            path: 'list',
            component: MfgRoutingListComponent
        },
        {
            path: 'create',
            component: MfgRoutingFormComponent
        },
        {
            path: ':routingId/edit',
            component: MfgRoutingFormComponent
        },
        {
            path: ':routingId',
            component: MfgRoutingFormComponent
        },
        {
            path: '**',
            redirectTo: 'list'
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MfgRoutingRoutingModule {
}
