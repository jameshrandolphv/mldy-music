import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from './components/discover/discover.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HamburgerPaneComponent } from './components/hamburger-pane/hamburger-pane.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { AdminComponent } from './components/admin/admin.component';
import { GuardService } from './services/guard.service';
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CreateTrackComponent } from './components/create-track/create-track.component';
import { UploadTrackComponent } from './components/upload-track/upload-track.component';
import { FollowingComponent } from './components/following/following.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AuthService } from './services/auth.service';
import { OtherUserProfileComponent } from './components/other-user-profile/other-user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'upload', component: UploadTrackComponent, canActivate: [GuardService] },
  { path: 'discover', component: DiscoverComponent, canActivate: [GuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [GuardService] },
  { path: 'hamburger-pane', component: HamburgerPaneComponent, canActivate: [GuardService] },
  { path: 'api-test', component: ApiTestComponent, canActivate: [AuthService] },
  { path: 'create-account', component: CreateAccountComponent, canActivate: [GuardService]  },
  { path: 'create-track', component: CreateTrackComponent, canActivate: [GuardService]  },
  { path: 'following', component: FollowingComponent, canActivate: [GuardService]  },
  { path: 'settings', component: SettingsComponent, canActivate: [GuardService]  },
  { path: 'notifications', component: NotificationsComponent, canActivate: [GuardService]  },
  { path: 'other-user-profile', component: OtherUserProfileComponent, canActivate: [GuardService]  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
