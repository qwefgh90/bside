import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, LOCATION_TOKEN } from './login/login.component';
import { RedirectComponent } from './redirect/redirect.component';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule, 
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatIcon,
} from '@angular/material';
import { OAuthService } from './service/o-auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatabaseToken } from '../db/database';
import { LocalDbService } from '../db/local-db.service';
import { CookieToken } from '../db/cookie';

@NgModule({
  declarations: [LoginComponent, RedirectComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{provide: LOCATION_TOKEN, useValue: window.location}, {provide: CookieToken, useClass: LocalDbService}]
})
export class AuthModule { }
