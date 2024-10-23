import { Routes } from '@angular/router';
import { InscriptionComponent } from './features/authentication/inscription/components/inscription/inscription.component';
import { ConnexionComponent } from './features/authentication/connexion/components/connexion/connexion.component';
import { UserProfileComponent } from './features/profile/components/user-profile/user-profile.component';
import { ProductCartComponent } from './features/products/components/product-cart/product-cart.component';
import { ProductsListComponent } from './features/products/components/products-list/products-list.component';
import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';
import { WishlistComponent } from './features/products/components/wishlist/wishlist.component';
import { ProductsByCategoryComponent } from './features/products/components/products-by-category/products-by-category.component';
import { SearchProductsComponent } from './features/products/components/search-products/search-products.component';

export const routes: Routes = [
    {path: '', component: ProductsListComponent},
    {path: "inscription", component: InscriptionComponent},
    {path: "connexion", component: ConnexionComponent},
    {path: 'profil', component: UserProfileComponent},
    {path: 'panier', component: ProductCartComponent},
    {path: 'produit/:id', component: ProductDetailComponent},
    {path: 'wishlist', component: WishlistComponent},
    {path: ':category_name', component: ProductsByCategoryComponent},
    {path: 'products/search', component: SearchProductsComponent}

];
