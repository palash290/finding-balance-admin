import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  paidUsers: any;
  paidCoaches: any;
  searchQuery: string = '';

  constructor(private service: SharedService) {}

  ngOnInit() {
    this.getUsers();
    //this.getCoaches();
  }

  getUsers() {
    this.service.getApi('userSubscription').subscribe({
      next: resp => {
        this.paidUsers = resp.data.userSubscriptions;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  getCoaches() {
    this.service.getApi('coachSubscription').subscribe({
      next: resp => {
        this.paidCoaches = resp.data.coachSubscriptions;
       // this.searchQuery = '';
      },
      error: error => {
        console.log(error.message)
      }
    });
  }


}
