import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AlertUtilities {
    
    showSnackBar = true;

    constructor(private snackBar: MatSnackBar) {
    }

    actionButtonLabel: string = 'Retry';
    action: boolean = false;
    setAutoHide: boolean = true;
    autoHide: number = 3000;
    addExtraClass: boolean = true;

    showAlerts(msg: string, force = false) {
        if (this.showSnackBar || force) {
            let config = new MatSnackBarConfig();
            config.duration = this.autoHide;
            config.panelClass = this.addExtraClass ? ['party'] : undefined;
            this.snackBar.open(msg, this.action ? this.actionButtonLabel : undefined, config);
        }
    }

    allowAlerts() {
        this.showSnackBar = true;
    }

    blockAlerts() {
        this.showSnackBar = false;
    }

}