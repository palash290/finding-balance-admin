import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  data: any;
  searchQuery: string = '';
  isFollowing: { [key: number | string]: boolean } = {};
  avatar_url_fb: any;

  isCoach: boolean = true;
  role: string | undefined;

  constructor(private service: SharedService, private location: Location, private toastr: ToastrService) {
    // this.role = this.service.getRole();
    // if (this.role == 'USER') {
    //   this.isCoach = false;
    // }
    // if(!this.isCoach){
    //   this.location.back();
    //   return
    // }
  }


  backClicked() {
    this.location.back();
  }

  ngOnInit() {



    this.searchCategories();
  }



  searchCategories() {
    const url = `getAllCategory`;
    this.service.getApi(url).subscribe({
      next: resp => {
        this.data = resp.data.categoryList || [];
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  btnLoader: boolean = false;
  followId: any;



  btnLoaderCreate: boolean = false;
  nameError: boolean = false;
  nameError1: boolean = false;
  name: any;
  @ViewChild('closeModal') closeModal!: ElementRef;

  addName() {
    // Check if name is empty
    if (!this.name || this.name.trim() === '') {
      this.nameError = true;
      return;
    } else {
      this.nameError = false; // Reset the error state
    }

    this.btnLoaderCreate = true;
    const formData = new URLSearchParams();
    formData.set('categoryName', this.name);

    this.service.postAPI('addCategory', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal.nativeElement.click();
          this.searchCategories();
          this.service.triggerRefresh();
          this.name = ''
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
        console.log(error.statusText);
      }
    });
  }

  updateName: any;

  catId: any;

  getId(id: any, name: any) {
    this.catId = id;
    this.updateName = name;
  }

  @ViewChild('closeModal1') closeModal1!: ElementRef;

  editName() {
    // if (!this.updateName || this.updateName.trim() === '') {
    //   this.nameError1 = true;
    //   return;
    // } else {
    //   this.nameError1 = false; // Reset the error state
    // }

    if (!this.updateName || this.updateName.trim().length === 0) {
      this.nameError1 = true;
      return;
    } else {
      this.nameError1 = false; // Reset the error state
    }

    this.btnLoaderCreate = true;
    const formData = new URLSearchParams();
    formData.set('id', this.catId);
    formData.set('categoryName', this.updateName);

    this.service.postAPI('editCategory', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal1.nativeElement.click();
          this.searchCategories();
          this.service.triggerRefresh();
          this.toastr.success(resp.message);
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
        console.log(error.statusText);
      }
    });
  }


}
