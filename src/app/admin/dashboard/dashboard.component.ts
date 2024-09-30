import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  dashBoard: any;

  constructor(private service: SharedService) {}

  ngOnInit() {
    this.getdashBoard();
  }
  
  getdashBoard() {
    this.service.getApi('dashBoard').subscribe({
      next: resp => {
        this.dashBoard = resp.data;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

}
