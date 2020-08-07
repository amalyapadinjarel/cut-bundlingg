import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  getTrendzBiToken(): String {
    return window.localStorage['trendzBIAuthentication'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  saveTrendzBiToken(token: String) {
    window.localStorage['trendzBIAuthentication'] = token;
  }

  saveResetToken(token: String) {
    window.localStorage['resetToken'] = token;
  }

  getResetToken(): String {
    return window.localStorage['resetToken'];

  }


  destroyToken() {
    localStorage.removeItem('trendzBIAuthentication');
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('resetToken');
  }

}
