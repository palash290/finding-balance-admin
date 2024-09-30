import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SettingComponent } from './setting/setting.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoachesComponent } from './coaches/coaches.component';
import { UsersComponent } from './users/users.component';
import { CommunitiesComponent } from './communities/communities.component';
import { TeamsComponent } from './teams/teams.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { EventsComponent } from './events/events.component';
import { UpdatePlanComponent } from './update-plan/update-plan.component';
import { FilterPipe } from '../services/filter.pipe';
import { SingleEventComponent } from './single-event/single-event.component';
import { PlanComponent } from './plan/plan.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MyProfileComponent,
    SettingComponent,
    ChangePasswordComponent,
    CoachesComponent,
    UsersComponent,
    CommunitiesComponent,
    TeamsComponent,
    CategoriesComponent,
    SubscriptionComponent,
    EventsComponent,
    //FilterPipe,
    //ChatFilterPipe,
    UpdatePlanComponent,
   SingleEventComponent,
   PlanComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //FilterPipe
  ]
})
export class AdminModule { }
