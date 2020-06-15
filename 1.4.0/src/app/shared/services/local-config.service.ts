import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';

const _key = 'trendz-v5';

@Injectable()
export class LocalConfigService {

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {

    }

    getStorage() {
        return new TrendzLocalStorage(this.storage.get(_key));
    }

    setStorage(storage) {
        this.storage.set(_key, new TrendzLocalStorage(storage));
    }

    getSettings() {
        return new StorageSettings(this.getStorage().settings);
    }

    setSettings(settings) {
        let storage = this.getStorage();
        storage.settings = new StorageSettings(settings);
        this.setStorage(storage);
    }

    getSchedulerConfig() {
        return new SchedulerConfig(this.getSettings().scheduler);
    }

    setSchedulerConfig(config) {
        let settings = this.getSettings();
        settings.scheduler = new SchedulerConfig(config);
        this.setSettings(settings);
    }

    isReportPreviewInBackground() {
        return this.getSchedulerConfig().runReportPreviewInBackground;
    }

    runReportPreviewInBackground(value = true) {
        let config = this.getSchedulerConfig();
        config.runReportPreviewInBackground = value;
        this.setSchedulerConfig(config);
    }

    isReportsInBackground() {
        return this.getSchedulerConfig().runReportsInBackground;
    }

    runReportsInBackground(value = true) {
        let config = this.getSchedulerConfig();
        config.runReportsInBackground = value;
        this.setSchedulerConfig(config);
    }
}

export class TrendzLocalStorage {
    settings;
    constructor(data) {
        if (!data)
            data = {};
        this.settings = data.settings || {};
    }
}
export class StorageSettings {
    scheduler;
    constructor(data) {
        if (!data)
            data = {};
        this.scheduler = data.scheduler || {};
    }
}
export class SchedulerConfig {
    runReportsInBackground;
    runReportPreviewInBackground;
    constructor(data) {
        if (!data)
            data = {};
        this.runReportsInBackground = data.runReportsInBackground || false;
        this.runReportPreviewInBackground = data.runReportPreviewInBackground || false;
    }
}