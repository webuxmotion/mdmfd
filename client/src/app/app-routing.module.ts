import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { CategoriesFormComponent } from './categories-page/categories-form/categories-form.component';
import { OneDeskPageComponent } from './one-desk-page/one-desk-page.component';


const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', component: OverviewPageComponent},
      { path: 'desks', redirectTo: ''},
      { path: 'desks/:id', component: OneDeskPageComponent},
      { path: 'overview', component: OverviewPageComponent},
      { path: 'analytics', component: AnalyticsPageComponent},
      { path: 'history', component: HistoryPageComponent},
      { path: 'order', component: OrderPageComponent},
      { path: 'categories', component: CategoriesPageComponent},
      { path: 'categories/new', component: CategoriesFormComponent},
      { path: 'categories/:id', component: CategoriesFormComponent},
      
    ]
  },
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent, canActivate: [AuthGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
