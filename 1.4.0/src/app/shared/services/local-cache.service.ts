import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { JSONUtils } from '../utils/json.utility';

const _key = 'trendz-v5-cache';

@Injectable()
export class LocalCacheService {

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    }

    getStorage() {
        return this.storage.has(_key) ? this.storage.get(_key) : {};
    }

    setStorage(storage) {
        this.storage.set(_key, storage);
    }

    setLocalCache(path: string, data: any) {
        let storage: object = this.getStorage();
        JSONUtils.setJSONPath(storage, path, data);
        this.setStorage(storage);
    }

    getCachedValue(path: string) {
        return JSONUtils.getJSONPath(this.getStorage(), path);
    }

    deleteLocalCache(path: string, data: any) {
        let storage: object = this.getStorage();
        JSONUtils.deleteJSONPath(storage, path, data);
        this.setStorage(storage);
    }
}