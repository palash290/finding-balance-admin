import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SettingComponent } from './setting/setting.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CoachesComponent } from './coaches/coaches.component';
import { UsersComponent } from './users/users.component';
import { CommunitiesComponent } from './communities/communities.component';
import { TeamsComponent } from './teams/teams.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { CategoriesComponent } from './categories/categories.component';
import { EventsComponent } from './events/events.component';
import { UpdatePlanComponent } from './update-plan/update-plan.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { PlanComponent } from './plan/plan.component';
import { ReportsComponent } from './reports/reports.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: "my-profile",
        component: MyProfileComponent,
      },
      {
        path: "my-profile/:id/:role",
        component: MyProfileComponent,
      },
      {
        path: "coaches",
        component: CoachesComponent,
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
      },
      {
        path: "users",
        component: UsersComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "communities",
        component: CommunitiesComponent,
      },
      {
        path: "teams",
        component: TeamsComponent,
      },
      {
        path: "subscription",
        component: SubscriptionComponent,
      },
      {
        path: "settings",
        component: SettingComponent,
      },
      {
        path: "categories",
        component: CategoriesComponent,
      },
      {
        path: "events",
        component: EventsComponent,
      },
      {
        path: "update-plan",
        component: UpdatePlanComponent,
      },
      {
        path: "single-event/:eventId",
        component: SingleEventComponent,
      },
      {
        path: "plan",
        component: PlanComponent,
      },
      {
        path: "reports",
        component: ReportsComponent,
      },
      {
        path: "manage-home",
        component: LandingPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
