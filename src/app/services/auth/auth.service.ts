import { Injectable } from '@angular/core';
import 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { isPlatform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {
  FacebookLoginPlugin,
  FacebookLogin,
} from '@capacitor-community/facebook-login';
import { Plugins, registerWebPlugin } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';

 registerWebPlugin(FacebookLogin);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fb: FacebookLoginPlugin;
  user = null;
  token = null;

  constructor(
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private http: HttpClient
  ) {
    this.setupFbLogin();
  }

  async setupFbLogin() {
    if (isPlatform('desktop')) {
      this.fb = FacebookLogin;
    } else {
      // Use the native implementation inside a real app!
      const { FacebookLogin } = Plugins;
      this.fb = FacebookLogin;
    }
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            // this.firebaseService.unsubscribeOnLogOut();
            resolve(null);
          })
          .catch(() => {
            reject();
          });
      }
    });
  }

  doLoginGoogleWEB() {
    return this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  async doLoginGoogleAndroid() {
    const res = await this.googlePlus.login({
      webClientId:
        '884850466812-bes25qk9bdql5llklgs1cgenhrtdpds1.apps.googleusercontent.com',
      offline: true,
    });

    return this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(res.idToken)
    );
  }

  async login() {
    const FACEBOOK_PERMISSIONS = ['email', 'public_profile', 'user_friends'];
    const result = await this.fb.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    const promise: Promise<any> = new Promise(async (resolve) => {
      if (result.accessToken && result.accessToken.userId) {
        this.token = result.accessToken;
        this.loadUserData().subscribe((res) => {
          this.user = res;
          resolve(res);
        });
      } else if (result.accessToken && !result.accessToken.userId) {
        // Web only gets the token but not the user ID
        // Directly call get token to retrieve it now
        const result2 = await this.fb.getCurrentAccessToken();
        if (result2.accessToken) {
          this.token = result2.accessToken;
          this.loadUserData().subscribe((res) => {
            this.user = res;
            resolve(res);
          });
        } else {
          // Not logged in.
          resolve('Not logged in.');
        }
      } else {
        // Login failed
        resolve('Login failed');
      }
    });

    return promise;
  }

  private loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    return this.http.get(url);
  }

  async logout() {
    await this.fb.logout();
    this.user = null;
    this.token = null;
  }

  /* doLoginFacebookWEB() {
    return this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  // platform.is('desktop')
  async doLoginFacebookAndroid() {
    const res: FacebookLoginResponse = await this.fb.login([
      'public_profile',
      'email',
    ]);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      res.authResponse.accessToken
    );
    return this.afAuth.auth.signInWithCredential(facebookCredential);
  } */
}
