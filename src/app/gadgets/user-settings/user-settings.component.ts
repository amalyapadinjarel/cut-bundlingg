
import { Component, OnInit } from '@angular/core';

import { LocalConfigService } from 'app/shared/services';
import { UserSettings } from 'app/gadgets/user-settings/user-settings.interface';

@Component({
    selector: 'user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

    userSettings: UserSettings;

    constructor(
        public localConfig: LocalConfigService
    ) {
    }

    ngOnInit() {
        this.ListSettingsFromLocal();
    }

    reload() {
        this.ListSettingsFromLocal();
    }

    ListSettingsFromLocal() {
        this.userSettings = new UserSettings(this.localConfig.getSettings());
    }

    runReportsInBackground() {
        this.localConfig.runReportsInBackground(this.userSettings.scheduler.runReportsInBackground);
    }

    runReportPreviewInBackground() {
        this.localConfig.runReportPreviewInBackground(this.userSettings.scheduler.runReportPreviewInBackground);
    }
}