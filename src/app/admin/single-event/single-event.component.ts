import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent {

  eventId: any;
  role: any;
  followersList: any[] = [];
  userPlan: any;

  constructor(private route: ActivatedRoute, private service: SharedService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      console.log('Event ID:', this.eventId);
      this.getEventData(this.eventId);
    });
  }

  stripeLink: any;
  btnLoaderPay: boolean = false;



  ngOnDestroy() {
    localStorage.removeItem('adHocEventId');
  }

  redirect() {
    window.location.href = this.stripeLink;
  }

  getPaidGuest() {
    this.service.getApi(`event/paidUsers/${this.eventId}`).subscribe(response => {
      if (response.success) {
        this.followersList = response.data;
      }
    });
  }

  eventData: any;

  getEventData(id: any) {
    this.service.getApi(`allEvents/${id}`).subscribe({
      next: (resp) => {
        this.eventData = resp.data;
       // this.getEventListData();
        //this.data = resp.data?.map((item: any) => ({ ...item, isExpanded: false })).reverse();
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  eventListData: any;

  // getEventListData() {
  //   this.service.getApi('user/event/allEvents').subscribe({
  //     next: resp => {

  //       this.eventListData = resp.data;
  //       if (this.eventData) {
  //         this.eventListData = this.eventListData.filter((event: { id: any; }) => event.id !== this.eventData.id);
  //       }

  //       //this.data = resp.data?.map((item: any) => ({ ...item, isExpanded: false })).reverse();
  //     },
  //     error: error => {
  //       console.log(error.message)
  //     }
  //   });
  // }

  getEventId(eventId: any) {
    this.router.navigateByUrl(`user/main/events/${eventId}`)
  }

  getEventEditId(eventId: any) {
    this.router.navigateByUrl(`user/main/edit-event/${eventId}`)
  }

  backClicked() {
    this.location.back();
  }

}
