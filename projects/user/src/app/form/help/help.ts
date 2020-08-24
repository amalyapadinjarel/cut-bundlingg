import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSharedService } from '../../_service/user-shared.service';
import { UserAppService } from '../../_service/user.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromFacilityLovConfig } from '../../models/lov-config';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserOrgAccess } from '../../models/user-org-access';
import { IfStmt } from '@angular/compiler';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { User } from 'app/shared/models';

@Component({
    selector: 'help',
    templateUrl: './help.html',
    styleUrls: ['./help.scss']
})
export class HelpComponent implements OnInit {

    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

    public key = 'help';
    folders: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
    notes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

    constructor(

        private dialogRef: MatDialogRef<HelpComponent>

    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }






}
