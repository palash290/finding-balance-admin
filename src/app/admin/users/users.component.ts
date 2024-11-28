import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  p: any = 1;
  data: any;
  searchQuery: string = '';
  isFollowing: { [key: number | string]: boolean } = {};
  avatar_url_fb: any;

  isCoach: boolean = true;
  role: string | undefined;

  constructor(private router: Router, private service: SharedService, private location: Location, private toastr: ToastrService) {}

  handleCheckboxChange(row: any) {

    if (row.status == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this user!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggleUserStatus/${row.id}`, null).subscribe({
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
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to deactive this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggleUserStatus/${row.id}`, null).subscribe({
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
  }

  getCategories() {
    this.service.getApi('user/interestedCategories').subscribe({
      next: resp => {
        this.data = resp.data
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  searchCategories() {
    const url = `allUsers?search=${this.searchQuery}`;
    this.service.getApi(url).subscribe({
      next: resp => {
        this.data = resp.data.users || [];

    
        
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

  getUserId(uderId: any, role:any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }


  // onUpdateSubscription(category: any): void {
  //   const confirmUpdate = confirm(
  //     `Are you sure you want to update the subscription for ${category.full_name}?`
  //   );
  //   if (!confirmUpdate) return;
  
  //   this.getSubscriptonUser(category.id);
  // }
  
  getSubscriptonUser(userId: any): void {
    const formURlData = new URLSearchParams();
    formURlData.set('userId', userId);
    formURlData.set('planId', '2');
  
    this.service.postAPI('subscription/create-subscription', formURlData.toString())
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message);
        },
        error: (error) => {
          console.error('Subscription Update Error:', error);
          this.toastr.error('Failed to update subscription. Please try again later.');
        }
      });
  }

  onUpdateSubscription(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to give this user a premium subscription for a month!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const formURlData = new URLSearchParams();
        formURlData.set('coachId', user.id);
        formURlData.set('planId', '2');
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
