import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.css'
})
export class CoachesComponent {

  p: any = 1;
  data: any;
  searchQuery: string = '';
  isFollowing: { [key: number | string]: boolean } = {};
  avatar_url_fb: any;

  isCoach: boolean = true;
  role: string | undefined;

  constructor(private router: Router, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  handleCheckboxChange(row: any) {
    if (row.status == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this user!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#e58934",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggleCoachStatus/${row.id}`, null).subscribe({
            next: resp => {
              //console.log(resp)
              this.toastr.success(resp.message)
              this.searchCategories();
            }
          })
        } else {
          this.searchCategories();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to deactive this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e58934",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggleCoachStatus/${row.id}`, null).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.searchCategories();
            }
          })
        } else {
          this.searchCategories();
        }
      });

    }
  }


  backClicked() {
    this.location.back();
  }

  ngOnInit() {
    this.searchCategories();
    this.service.getApi('getAllCategory').subscribe(response => {
      if (response.success) {
        this.categories = response.data.categoryList;
      }
    });
  }

  categoryId: any = '';
  selectedCategoryName: string | undefined;
  categories: any[] = [];

  onCategoryChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.categories.find(category => category.id == selectedId);

    if (selectedCategory) {
      this.categoryId = selectedCategory.id;
      this.selectedCategoryName = selectedCategory.name;
      console.log('Selected Category ID:', this.categoryId);
      console.log('Selected Category Name:', this.selectedCategoryName);
    }
    this.searchCategories()
  }

  getCategories() {
    this.service.getApi('allCoaches').subscribe({
      next: resp => {
        this.data = resp.data
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  searchCategories() {
    const url = `allCoaches?categoryId=${this.categoryId}&search=${this.searchQuery}`;
    this.service.getApi(url).subscribe({
      next: resp => {
        this.data = resp.data.coaches || [];
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  btnLoader: boolean = false;

  followId: any;

  unfollowCatg(postId: any) {
    //this.isLike = !this.isLike;
    this.followId = postId;
    this.btnLoader = true

    this.service.postAPI(`user/unfollow/${postId}`, null).subscribe({
      next: resp => {
        console.log(resp);
        this.getCategories();
        this.btnLoader = false;
      },
      error: error => {
        this.btnLoader = false
        console.log(error.message)
      }
    });
  }

  getCoachId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }



  onUpdateSubscription(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to give this coach a premium subscription for a month!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e58934',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const formURlData = new URLSearchParams();
        formURlData.set('coachId', user.id);
        formURlData.set('planId', '4');
        this.service.postAPI(`Gift-subscription`, formURlData.toString()).subscribe({
          next: (resp) => {
            if (resp.success) {
              // Swal.fire(
              //   'Deleted!',
              //   'Your post has been deleted successfully.',
              //   'success'
              // );
              this.searchCategories();
              this.toastr.success(resp.message);
            } else {
              this.searchCategories()
              this.toastr.warning(resp.message);
            }
          },
          error: (error) => {
            // Swal.fire(
            //   'Error!',
            //   'There was an error deleting your post.',
            //   'error'
            // );
            this.searchCategories()
            this.toastr.error('Something went wrong!');
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }


}
