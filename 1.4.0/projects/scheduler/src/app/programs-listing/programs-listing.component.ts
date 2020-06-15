
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Program, Group } from "../_models";
import { SchedulerService } from "../_services";
import { CommonUtilities } from 'app/shared/utils/common.utility';

@Component({
    selector: 'programs-listing',
    templateUrl: './programs-listing.component.html',
    styleUrls: ['./programs-listing.component.scss']
})
export class ProgramsListingComponent implements OnInit, OnDestroy {

    searchInput: FormControl;
    searchText = "";

    selGroup = "--";
    groups: Group[] = [];
    programs: Program[] = [];
    frequentPrograms: Program[] = [];
    loading = true;

    constructor(
        private _service: SchedulerService
    ) {
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        this.searchInput.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged())
            .subscribe(searchText => {
                this.searchText = searchText;
                this.preparePrograms();
            });
        this.loadProgarms();
    }

    ngOnDestroy() {
    }

    loadProgarms(force = false) {
        this.loading = true;
        this._service.fetchPrograms(force).then(() => {

            this.loading = false;
            this.programs = this._service.programs;
            this.frequentPrograms = this._service.frequentPrograms;
            this.preparePrograms();
        }, () => { });
    }

    reloadPrograms() {
        this.loadProgarms(true);
    }

    preparePrograms() {
        this.groups = [];
        if (this.searchText) {
            this.programs = CommonUtilities.filterArrayByString(this._service.programs, this.searchText);
        }
        else {
            this.programs = this._service.programs;
        }
        let grp: Group;
        let groupFound = false;
        for (let pgm of this.programs) {
            grp = this.groups.find(grp => {
                return grp.handle === pgm.application;
            });
            if (grp) {
                grp.count++;
            }
            else {
                this.groups.push(new Group(pgm));
                if (this.selGroup === pgm.application)
                    groupFound = true;

            }
        }
        if (this.programs.length > 0) {
            this.groups.push({ "handle": "--", "title": "All", "count": this.programs.length });
        }
        if (groupFound) {
            this.programs = this.programs.filter(pgm => {
                return pgm.application === this.selGroup;
            });
        }
        else {
            this.selGroup = "--";
        }
        CommonUtilities.sortArray(this.groups, 'title');
    }

    selectGroup(handle) {
        if (this.selGroup !== handle) {
            this.selGroup = handle;
            this.preparePrograms();
        }
    }

    searchProgram() {
        this.preparePrograms();
    }

    loadProgram(pgmId) {
        this._service.loadProgram(pgmId);
    }

}
