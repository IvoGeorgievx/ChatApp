import { Routes } from '@angular/router';
import { RegisterComponent } from './shared/components/register/register.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/:roomId',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];
