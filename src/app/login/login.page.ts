import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public result: any = null;
  constructor(private authService: AuthService) {}

  public registrar() {
    const email = 'jagc93.jg@gmail.com';
    const password = '123456';

    this.authService.doRegister({ email, password }).then(
      (result) => {
        console.log('register', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public ingresar() {
    const email = 'jagc93.jg@gmail.com';
    const password = '123456';

    this.authService.doLogin({ email, password }).then(
      (result) => {
        console.log('login', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public ingresarGoogle() {
    this.authService.doLoginGoogleWEB().then(
      (result) => {
        console.log('login', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public ingresarGoogleAndroid() {
    this.authService.doLoginGoogleAndroid().then(
      (result) => {
        console.log('login', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public ingresarFacebook() {
    this.authService.login().then(
      (result) => {
        console.log('login', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public ingresarFacebookAndroid() {
    this.authService.login().then(
      (result) => {
        console.log('login', result);
        this.result = result;
      },
      (e) => (this.result = e)
    );
  }

  public logoutFB() {
    this.authService
      .logout()
      .then(() => (this.result = '¡Logout Success!'))
      .catch(() => (this.result = 'Fail logut'));
  }

  ngOnInit() {}
}
