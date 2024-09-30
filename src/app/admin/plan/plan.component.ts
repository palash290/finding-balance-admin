import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {

  paidUsers: any;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.service.getApi('plan/allPlans').subscribe({
      next: resp => {
        this.paidUsers = resp.plans;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  btnLoaderCreateUser: boolean = false;
  userError: boolean = false;
  userPrice: any;
  @ViewChild('closeModal') closeModal!: ElementRef;

  userErrorMessage: string = '';

  editUser() {
    const priceValue = this.userPrice != null ? String(this.userPrice).trim() : '';

    if (!priceValue) {
      this.userError = true;
      this.userErrorMessage = 'Price is required.';
      return;
    }

    if (isNaN(+priceValue)) { 
      this.userError = true;
      this.userErrorMessage = 'Price must be a valid number.';
      return;
    }

    if (priceValue.length > 3) {
      this.userError = true;
      this.userErrorMessage = 'Price can not be greater than 999.';
      return;
    }

    const priceNumber = parseFloat(priceValue);

    if (priceNumber < 0) {
      this.userError = true;
      this.userErrorMessage = 'Price cannot be negative.';
      return;
    }

    this.userError = false;

    this.btnLoaderCreateUser = true;
    const formData = new URLSearchParams();
    formData.set('id', this.userId);
    formData.set('price', this.userPrice);

    this.service.postAPI('plan/allPlans', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal.nativeElement.click();
          this.getUsers();
        } else {
          this.toastr.warning(resp.message);
        }
        this.btnLoaderCreateUser = false;
      },
      error: (error) => {
        this.btnLoaderCreateUser = false;
        this.toastr.error('Something went wrong.');
        console.log(error.statusText);
      }
    });
  }

  btnLoaderCreateCoach: boolean = false;
  coachError: boolean = false;
  coachPrice: any;
  @ViewChild('closeModal1') closeModal1!: ElementRef;

  coachErrorMessage: string = '';


  editCoach() {
    // Convert coachPrice to a string, then trim the input to avoid leading/trailing whitespace
    const priceValue = this.coachPrice != null ? String(this.coachPrice).trim() : '';

    // Check if coachPrice is empty
    if (!priceValue) {
      this.coachError = true;
      this.coachErrorMessage = 'Price is required.';
      return;
    }

    // Check if coachPrice is a valid number
    if (isNaN(+priceValue)) { // The `+` operator converts the string to a number for validation
      this.coachError = true;
      this.coachErrorMessage = 'Price must be a valid number.';
      return;
    }

    // Check if price is exactly 5 digits
    if (priceValue.length > 3) {
      this.coachError = true;
      this.coachErrorMessage = 'Price can not be greater than 999.';
      return;
    }

    // Parse the priceValue as a number
    const priceNumber = parseFloat(priceValue);

    // Check if the number is negative
    if (priceNumber < 0) {
      this.coachError = true;
      this.coachErrorMessage = 'Price cannot be negative.';
      return;
    }

    // If all validations pass, reset the error and proceed with the API call
    this.coachError = false;
    this.btnLoaderCreateCoach = true;

    const formData = new URLSearchParams();
    formData.set('id', this.coachId);
    formData.set('price', priceValue);

    this.service.postAPI('plan/allPlans', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal1.nativeElement.click();
          this.getUsers();
        } else {
          this.toastr.warning(resp.message);
        }
        this.btnLoaderCreateCoach = false;
      },
      error: (error) => {
        this.btnLoaderCreateCoach = false;
        this.toastr.error('Something went wrong.');
        console.log(error.statusText);
      }
    });
  }

  userId: any;
  coachId: any;

  getUserPrice(price: any, id: any) {
    this.userPrice = price;
    this.userId = id;
  }

  getCoachPrice(price: any, id: any) {
    this.coachPrice = price;
    this.coachId = id;
  }


}
