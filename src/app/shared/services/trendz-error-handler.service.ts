import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class TrendzErrorHandler extends ErrorHandler {

    constructor() {
        super();
    }

    handleError(error) {
        if (error) {
            throw error;
        }
    }

}