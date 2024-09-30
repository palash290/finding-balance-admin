import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  userDetails: any;
  role: any;
  eventData: any;
  isMenuVisible: boolean = false;
  stripeLink: any;

  constructor(private router: Router, private visibilityService: SharedService) {}

  onToggleMenu() {
    this.visibilityService.toggleMenuVisibility();
  }

  // toggleClass() {
  //   this.visibilityService.toggle();  // Directly call the toggle method
  // }

  unreadNotifications: any;
  userId: any;
  planName: any;
  planPrice: any;
  userPlan: any;
  plan_expired_at: any;

  ngOnInit() {

    this.visibilityService.refreshSidebar$.subscribe(() => {
      this.grtProfile();
    });

    const jaonData: any = localStorage.getItem('adminDetailFb');
    const data = JSON.parse(jaonData)
    this.userDetails = data;
  }

  about_me: any;
  name: any;
  avatar_url: any
  totalPosts: any;
  totalFollowers: any;
  category: any;
  isExpanded: boolean = false;
  numberOfFollowings: any;


  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  shouldShowReadMore() {
    return this.about_me?.length > 100; // Adjust the length as needed
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }


  grtProfile(){
    this.visibilityService.getApi('profile').subscribe({
      next: resp => {
        this.name = resp.data.full_name;
        this.avatar_url = resp.data.avatar_url;
      },
    });
  }


}
