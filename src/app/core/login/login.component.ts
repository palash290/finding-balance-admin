import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  isPasswordVisible: boolean = false;
  loginForm!: FormGroup
  loading: boolean = false;
  countries: { name: string, dialCode: string, flag: string }[] = [];
  selectedCountryCode: string = '91';

  constructor(private route: Router, private srevice: SharedService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //const countryList: any = countryCodes.all();

    // Map the list to the format required for the dropdown
    // this.countries = Object.keys(countryList).map(key => {
    //   const country = countryList[key];
    //   return {
    //     name: country.countryNameEn,
    //     dialCode: country.countryCallingCode,
    //     flag: `flag-icon flag-icon-${country.countryCode.toLowerCase()}`
    //   };
    // });

    this.initForm();
    //this.notifyService.requestPermission();
  }

  initForm() {
    const defaultCountry = this.countries[0];
    this.loginForm = new FormGroup({
      // phone_no: new FormControl('', [
      //   Validators.required,
      //   Validators.pattern('^[0-9]*$')  // Regex to allow only numbers
      // ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const fcmToken: any = localStorage.getItem('fcmFbToken')
      const formURlData = new URLSearchParams();
      //const countryCode = this.loginForm.get('countryCode')?.value;
      //const mobileNumber = this.loginForm.get('phone_no')?.value;
      //const fullMobileNumber = `+${countryCode}${mobileNumber}`;
      //const fullMobileNumber = `${countryCode}${mobileNumber}`;

      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      // if (fcmToken) {
      //   formURlData.set('fcm_token', fcmToken);
      // }

      this.srevice.loginUser('login', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.loading = false;
            localStorage.setItem('adminDetailFb', JSON.stringify(resp.admin));
            this.srevice.setToken(resp.token);
            this.route.navigateByUrl('/admin/main/dashboard');
          } else {
            this.loading = false;
            this.toastr.warning(resp.message)
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
          console.error('Login error:', error.error.message);
        }
      });
    }
  }

  userPlan: any;
  plan_expired_at: any;


  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.imageSrc = this.isPasswordVisible ? 'assets/img/open_eye.svg' : 'assets/img/close_eye.svg';
  }



  imageSrc: string = 'assets/img/close_eye.svg';

  forgotPassword(role: any) {
    this.route.navigateByUrl(`forgot-password/${role}`)
  }


}
