import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProjectsComponent } from './projects/projects.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProjectsComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    HttpClientModule,
    NgxChartsModule,
    MatProgressBarModule,
    AppRoutingModule,    MatButtonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            component: ProjectsComponent,
          },
          {
            path: 'dashboard/:projectId',
            component: DashboardComponent,
          },

        ]
      }
    ]),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
