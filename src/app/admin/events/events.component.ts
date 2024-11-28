import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {

  p: any = 1;
  //data: any;
  searchQuery: string = '';
  isFollowing: { [key: number | string]: boolean } = {};
  avatar_url_fb: any;
  eventData: any;

  role: string | undefined;

  constructor(private router: Router, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  backClicked() {
    this.location.back();
  }

  ngOnInit() {
    this.searchCategories();
  }

  getCategories() {
    this.service.getApi('allEvents').subscribe({
      next: resp => {
        this.eventData = resp.data.events;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  searchCategories() {
    const url = `allEvents?search=${this.searchQuery}`;
    this.service.getApi(url).subscribe({
      next: resp => {
        this.eventData = resp.data.events;
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

  getEventId(eventId: any) {
    this.router.navigateByUrl(`admin/main/single-event/${eventId}`)
  }

  deleteEvent(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e58934',
      cancelButtonColor: '#949296 ',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.postAPI(`deleteEvent/${id}`, '').subscribe({
          next: (resp) => {
            if (resp.success) {
              this.toastr.success(resp.message)
              this.searchCategories();
            } else {
              this.toastr.warning(resp.message)
              this.searchCategories();
            }
          },
          error: (error) => {
            this.searchCategories();
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }


}
