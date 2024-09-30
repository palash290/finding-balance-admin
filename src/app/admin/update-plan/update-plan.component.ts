import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.component.html',
  styleUrl: './update-plan.component.css'
})
export class UpdatePlanComponent {

  newForm!: FormGroup;
  loading: boolean = false;

  constructor(private service: SharedService, private route: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.newForm = new FormGroup({
      userPlan: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]),
      coachPlan: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]),
    });
  }

  UpdatePrice() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      this.loading = true;
      const formData = new URLSearchParams();
      formData.set('userPlan', this.newForm.value.userPlan);
      formData.set('coachPlan', this.newForm.value.coachPlan);

      this.service.postAPI('coach/event', formData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.route.navigateByUrl('admin/main/subscription')
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: error => {
          this.loading = false;
          this.toastr.error('Something went wrong.');
          console.log(error.statusText)
        }
      })
    }
  }

}
