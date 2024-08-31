import { Routes } from '@angular/router';
import { InscriptionComponent } from './features/authentication/inscription/components/inscription/inscription.component';
import { ConnexionComponent } from './features/authentication/connexion/components/connexion/connexion.component';

export const routes: Routes = [
    {path: "inscription", component: InscriptionComponent},
    {path: "connexion", component: ConnexionComponent}

];
