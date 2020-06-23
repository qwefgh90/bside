import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './oauth/auth.module';
import { HeaderComponent } from './header/header.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsModule } from './projects/projects.module';
import { GithubModule } from './github/github.module';
import { OAuthService } from './oauth/service/o-auth.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { TemplatesModule } from './templates/templates.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

export function initAuth(oauthService: OAuthService){
  return () => oauthService.initAccessTokenOnSession();
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomeComponent,
  ],
  imports: [
    StoreModule.forRoot({
      router: routerReducer
    }),
    ProjectsModule,
    TemplatesModule,
    AuthModule,
    AppRoutingModule,
    StoreRouterConnectingModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GithubModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule,
    FlexLayoutModule,
  ],
  providers: [{ provide: APP_INITIALIZER, useFactory: initAuth, deps: [OAuthService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
