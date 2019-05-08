import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './oauth/auth.module';
import { HeaderComponent } from './header/header.component';
import { MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsModule } from './projects/projects.module';
import { GithubModule } from './github/github.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomeComponent
  ],
  imports: [
    ProjectsModule,
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GithubModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
