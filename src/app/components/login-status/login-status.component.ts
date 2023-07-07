import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { Constants } from "../../common/constants";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
      @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // subsribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetch the logged in user details 
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;

        // save email address to session storage
        this.storage.setItem(Constants.USER_EMAIL_KEY, res.email);        
      });
    }  
  }

  logout() {
    // Terminates the session and removes current tokens.
    this.oktaAuth.signOut();

    // remove email from session storage
    this.storage.removeItem(Constants.USER_EMAIL_KEY);
  }

}
