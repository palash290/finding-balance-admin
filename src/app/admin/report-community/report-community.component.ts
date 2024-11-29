import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  @ViewChild('closeModalDel') closeModalDel!: ElementRef;

  viewCommunity(id: any){
    this.closeModalDel.nativeElement.click();
    this.router.navigateByUrl(`admin/main/communities/${id}`)
  }

  deleteCommunity(communityId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this community!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e58934',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.postAPI(`deleteCommunity/${communityId}`, null).subscribe({
          next: (resp) => {
            if (resp.success) {
              Swal.fire(
                'Deleted!',
                'Your community has been deleted successfully.',
                'success'
              );
              this.getReports();
            
            } else {
              this.getReports();
            }
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting your community.',
              'error'
            );
            this.getReports();
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }


}
