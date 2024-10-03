import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-passord',
  templateUrl: './forgot-passord.component.html',
  styleUrl: './forgot-passord.component.css'
})
export class ForgotPassordComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup;
  countries: { name: string, dialCode: string }[] = [];
  loading: boolean = false;

  role: string | undefined;

  constructor(private route: Router, private srevice: SharedService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }


  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();

      formURlData.set('email', this.loginForm.value.email);

      this.srevice.resetPassword('forgotPassword', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
          console.error('Login error:', error.message);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
