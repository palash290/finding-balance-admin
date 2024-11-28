import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-event',
  templateUrl: './report-event.component.html',
  styleUrl: './report-event.component.css'
})
export class ReportEventComponent {

  data: any;
  p: any = 1;
  searchQuery = '';

  constructor(private service: SharedService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.currentSearchQuery.subscribe(query => {
      this.searchQuery = query;
      this.getReports(); // Call your filter function here
    });
  }

  getReports() {
    this.service.getApi('allReports').subscribe({
      next: resp => {
        // Filter out elements where both community and event are not null
        this.data = resp.data.filter((item: any) => !(item.reportedEntity.community || item.reportedEntity.post));
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  eventData: any;
  //userDetails: any;
  reason: any;

  getPostById(post: any, reason: any) {
    console.log('post', post);
    this.reason = reason;
    this.eventData = { ...post, isExpanded: false };
  }

  getCoachId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }

  getUserId(uderId: any, role:any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }

  @ViewChild('closeModalDel') closeModalDel!: ElementRef;

  viewEvent(id: any){
    this.closeModalDel.nativeElement.click();
    this.router.navigateByUrl(`admin/main/single-event/${id}`)
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
              this.getReports();
            } else {
              this.toastr.warning(resp.message)
              this.getReports();
            }
          },
          error: (error) => {
            this.getReports();
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }
  

}
