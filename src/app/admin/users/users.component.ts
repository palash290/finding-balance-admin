import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  data: any;
  searchQuery: string = '';
  isFollowing: { [key: number | string]: boolean } = {};
  avatar_url_fb: any;

  isCoach: boolean = true;
  role: string | undefined;

  constructor(private router: Router, private service: SharedService, private location: Location) {
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


}
