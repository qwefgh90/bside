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
import { WorkspaceModule } from './workspace/workspace.module';
// import { TemplatesModule } from './templates/templates.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Store, StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { metaReducers } from './app-routing.reducer';
import { appReducer } from './app.reducer';
import { indexedDBReducer } from './db/indexed-db.reducer';
import { DatabaseToken } from './db/database';
import { LocalDbService } from './db/local-db.service';
import { IndexedDbService } from './db/indexed-db.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { signIn } from './oauth/auth.actions';

export function initAuth(db: LocalDbService, store: Store) {
  return () => {
    if(db.accessToken){
      store.dispatch(signIn({accessToken: db.accessToken}));
    }
  }
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomeComponent,
  ],
  imports: [
    StoreModule.forRoot({
      router: routerReducer,
      app: appReducer,
      indexedDB: indexedDBReducer
    }, {metaReducers}),
    AngularFireModule.initializeApp(environment.firebase),
    ProjectsModule,
    // TemplatesModule,
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
  providers: [
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [LocalDbService, Store], multi: true },
              {provide: DatabaseToken, useClass: LocalDbService},
              {provide: IndexedDbService, useClass: IndexedDbService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
