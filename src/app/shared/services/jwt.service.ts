import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  saveResetToken(token: String) {
    window.localStorage['resetToken'] = token;
  }

  getResetToken(): String {
    return window.localStorage['resetToken'];

  }


  destroyToken() {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('resetToken');
  }

}
