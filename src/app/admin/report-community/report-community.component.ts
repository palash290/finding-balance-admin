import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-community',
  templateUrl: './report-community.component.html',
  styleUrl: './report-community.component.css'
})
export class ReportCommunityComponent {

  data: any;
  p: any = 1;
  searchQuery = '';

  constructor(private service: SharedService, private router: Router) { }

  ngOnInit() {
    this.service.currentSearchQuery.subscribe(query => {
      this.searchQuery = query;
      this.getReports(); // Call your filter function here
    });
    //this.getReports();
  }

  getReports() {
    this.service.getApi('allReports').subscribe({
      next: resp => {
        //Filter out elements where both community and event are not null
        this.data = resp.data.filter((item: any) => !(item.reportedEntity.post || item.reportedEntity.event));
        console.log('sfdf', this.data);

      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  communityDetails: any;
  //userDetails: any;
  reason: any;

  getPostById(post: any, reason: any) {
    console.log('community details=====>', post);
    this.reason = reason;
    this.communityDetails = { ...post, isExpanded: false };
  }

  getCoachId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }

  getUserId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }


}
