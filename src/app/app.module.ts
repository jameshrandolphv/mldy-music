import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
  MatInputModule, MatCardModule, MatSlideToggleModule, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonToggleModule, MatTableModule, MatMenuModule, MatProgressSpinnerModule, MatSnackBarModule,
  MatPaginatorModule, MatSortModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscoverComponent } from './components/discover/discover.component';
import { TrackComponent } from './components/track/track.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { SearchBarComponent } from './components/nav-bar/search-bar/search-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HamburgerPaneComponent } from './components/hamburger-pane/hamburger-pane.component';
import { ChatPopupComponent } from './components/chat-popup/chat-popup.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HttpModule } from '@angular/http';
import { ConnectPopupComponent } from './components/connect-popup/connect-popup.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { TableComponent } from './components/table/table.component';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CreateTrackComponent } from './components/create-track/create-track.component';
import { UploadTrackComponent } from './components/upload-track/upload-track.component';
import { FollowingComponent } from './components/following/following.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SessionComponent } from './components/session/session.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { OtherUserProfileComponent } from './components/other-user-profile/other-user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    DiscoverComponent,
    TrackComponent,
    SidePanelComponent,
    ContactCardComponent,
    SearchBarComponent,
    ProfileComponent,
    HamburgerPaneComponent,
    ChatPopupComponent,
    LandingPageComponent,
    ConnectPopupComponent,
    AdminComponent,
    LoginComponent,
    TableComponent,
    ApiTestComponent,
    CreateAccountComponent,
    CreateTrackComponent,
    UploadTrackComponent,
    FollowingComponent,
    SettingsComponent,
    NotificationsComponent,
    SessionComponent,
    EditUserComponent,
    OtherUserProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    HttpModule,
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [
    ConnectPopupComponent,
    EditUserComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
