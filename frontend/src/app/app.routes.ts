import { Routes } from '@angular/router';
import { InscriptionComponent } from './features/authentication/inscription/components/inscription/inscription.component';
import { ConnexionComponent } from './features/authentication/connexion/components/connexion/connexion.component';
import { UserProfileComponent } from './features/profile/components/user-profile/user-profile.component';
import { DashboardStatsComponent } from './features/stats/components/dashboard-stats/dashboard-stats.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'inscription', 
        pathMatch: 'full' 
    },
    { 
        path: 'inscription', 
        component: InscriptionComponent 
    },
    { 
        path: 'connexion', 
        component: ConnexionComponent 
    },
    { 
        path: 'dashboard-stats', 
        component: DashboardStatsComponent,
        // canActivate: [AdminGuard],
    },
    { 
        path: 'profil', 
        component: UserProfileComponent 
    },
    { 
        path: '**', 
        redirectTo: 'inscription' 
    }
];