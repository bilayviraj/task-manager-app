import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { UserDataService } from '../user-data.service';


@Component({
  selector: 'app-slider-sign-form',
  templateUrl: './slider-sign-form.component.html',
  styleUrls: ['./slider-sign-form.component.css']
})
export class SliderSignFormComponent implements OnInit {

  showSignUpForm = false;
  isLoading = false;

  signupForm: FormGroup;
  signinForm: FormGroup;

  signinError: String;
  signupError: String;


  constructor(private router: Router, private http: HttpClient, private userDataService: UserDataService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });

    this.signinForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  changeForm() {
    this.showSignUpForm = !this.showSignUpForm;
  }

  onClose() {
    this.router.navigate(['/']);
  }

  onSignupSubmit() {
    this.isLoading = true;

    this.http.post('https://bsviraj-task-manager.herokuapp.com/users', this.signupForm.value).subscribe( (res) => {
      this.isLoading = false;
      this.userDataService.saveUserData(res);
      this.router.navigate(['/']);
      this.signupError =undefined;
    }, (error) => {
      this.isLoading = false;
      if(error['error']['keyValue']){
        this.signupError = 'Email id is already registered!';
      } else if(error['error']['errors']) {
        this.signupError = 'Password must be at least 8 characters long!';
      } else {
        this.signupError = 'Error occurred. Please try again!'
      }
    });
  }

  onSigninSubmit() {
    this.isLoading = true;

    this.http.post('https://bsviraj-task-manager.herokuapp.com/users/login', this.signinForm.value).subscribe( (res) => {
      this.isLoading = false;
      this.userDataService.saveUserData(res);
      this.router.navigate(['/']);
      this.signinError = undefined;
    }, (error) => {
      this.isLoading = false;
      if((typeof error['error']) === 'string'){
        this.signinError = error['error'];
      } else {
        this.signinError = 'Error occurred. Please try again!';
      }
    })
  }

}
