import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {

  @ViewChild('closeModal') closeModal!: ElementRef;
  userDetails: any;
  role: any;
  name: any;
  email: any;

  constructor(private srevice: SharedService, private toastr: ToastrService, private route: Router, private location: Location) { }
  ngOnInit(): void {
    const jaonData: any = localStorage.getItem('adminDetailFb');
    const data = JSON.parse(jaonData)
    this.userDetails = data;
    this.name = this.userDetails.full_name;
    this.email = this.userDetails.email;
    this.grtProfile();
  }

  backClicked() {
    this.location.back();
  }

  btnLoaderCreate: boolean = false;
  nameError: boolean = false;

  editName() {
    // Check if name is empty
    if (!this.name || this.name.trim() === '') {
      this.nameError = true;
      return;
    } else {
      this.nameError = false; // Reset the error state
    }

    this.btnLoaderCreate = true;
    const formData = new URLSearchParams();
    formData.set('full_name', this.name);

    this.srevice.postAPIFormDataPatch('profile', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal.nativeElement.click();
          this.grtProfile();
          this.srevice.triggerRefresh();
        } else {
          this.toastr.warning(resp.message);
        }
        this.btnLoaderCreate = false;
      },
      error: (error) => {
        this.btnLoaderCreate = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
        //console.log(error.statusText);
      }
    });
  }


  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e58934',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srevice.logout();
      }
    });
  }

  grtProfile() {
    this.srevice.getApi('profile').subscribe({
      next: resp => {
        this.name = resp.data.full_name;
      },
    });
  }


}
