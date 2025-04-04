import { Routes, RouterModule } from '@angular/router';
import { RescuesListComponent } from './components/pages/rescues-list/rescues-list.component';
import { RescueDetailComponent } from './components/pages/rescue-detail/rescue-detail.component';
import { LoginFormComponent } from './components/pages/login-form/login-form.component';
import { RegisterFormComponent } from './components/pages/register-form/register-form.component';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UnauthorizedComponent } from './components/pages/unauthorized/unauthorized.component';
import { HelpComponent } from './components/pages/help/help.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ApplicationFormComponent } from './components/pages/application-form/application-form.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { RescueOverviewComponent } from './components/admin/rescue-overview/rescue-overview.component';
import { AdminRescueListComponent } from './components/admin/admin-rescue-list/admin-rescue-list.component';
import { UpdateRescueFormComponent } from './components/admin/update-rescue-form/update-rescue-form.component';
import { CreateRescueFormComponent } from './components/admin/create-rescue-form/create-rescue-form.component';
import { ApplicationDetailComponent } from './components/admin/application-detail/application-detail.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { UserDetailComponent } from './components/admin/user-detail/user-detail.component';
import { InquiriesListComponent } from './components/admin/inquiries-list/inquiries-list.component';
import { InquiryDetailComponent } from './components/admin/inquiry-detail/inquiry-detail.component';
import { ApplicationsListComponent } from './admin/components/applications-list/applications-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'rescues',
    loadComponent: () =>
      import('./components/pages/rescues-list/rescues-list.component').then(
        (m) => m.RescuesListComponent
      ),
  },
  {
    path: 'rescues/:slug',
    component: RescueDetailComponent,
  },
  {
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        component: AdminRescueListComponent,
      },
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'users/user/:id',
        component: UserDetailComponent,
      },
      {
        path: 'applications',
        component: ApplicationsListComponent,
      },
      {
        path: 'rescue/:slug',
        component: RescueOverviewComponent,
      },
      {
        path: 'rescue/edit/:slug',
        component: UpdateRescueFormComponent,
      },
      {
        path: 'create-rescue',
        component: CreateRescueFormComponent,
      },
      {
        path: 'rescue/applications/:applicationId',
        component: ApplicationDetailComponent,
      },
      {
        path: 'inquiries',
        component: InquiriesListComponent,
        children: [
          {
            path: 'inquiry/:inquiryId',
            component: InquiryDetailComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'how-to-help',
    loadComponent: () =>
      import('./components/pages/help/help.component').then(
        (m) => m.HelpComponent
      ),
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./components/pages/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'inquire/:slug',
    component: ApplicationFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'contact-us',
    component: ContactComponent,
  },
  {
    path: 'user/:id',
    component: UserProfileComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

// Configure RouterModule with Scroll Restoration
export const AppRoutingModule = RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'enabled', // Restores scroll position on navigation
  anchorScrolling: 'enabled', // Enables scrolling to #anchors
});
