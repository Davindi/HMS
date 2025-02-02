import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageDoctorsComponent } from './manage-doctors/manage-doctors.component';
import { AddDoctorDialogComponent } from './add-doctor-dialog/add-doctor-dialog.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { BookNowComponent } from './book-now/book-now.component';
import { AuthGuard } from './auth.guard';
import { SessionsComponent } from './sessions/sessions.component';

export const routes: Routes = [

    {
        path: '',
        component: HomeComponent,
    },

    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: 'sign-up',
        component: SignUpComponent,
    },

    {
        path: 'userdashboard',
        component: UserDashboardComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'admindashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'managedoctors',
        component:ManageDoctorsComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'adddoctors',
        component:AddDoctorDialogComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'appointments',
        component:MyAppointmentsComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'alldoctors',
        component:DoctorListComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'booknow',
        component:BookNowComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'sessions',
        component: SessionsComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'doctors/:specialization',
        component:DoctorsComponent,
        canActivate: [AuthGuard]
    },

    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: '**', redirectTo: '/login' },
];
