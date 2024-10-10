import { Routes } from '@angular/router';
import { InscriptionComponent } from './features/authentication/inscription/components/inscription/inscription.component';
import { ConnexionComponent } from './features/authentication/connexion/components/connexion/connexion.component';
import { UserProfileComponent } from './features/profile/components/user-profile/user-profile.component';
import { ProductCartComponent } from './features/products/components/product-cart/product-cart.component';

export const routes: Routes = [
    {path: "inscription", component: InscriptionComponent},
    {path: "connexion", component: ConnexionComponent},
    {path: 'profil', component: UserProfileComponent},
    {path: 'panier', component: ProductCartComponent}

];
