import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    data: { hideToolbar: true }},
  { path: 'register', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)},
  { path: 'contac', loadChildren: () => import('./pages/contac/contac.module').then(m => m.ContacModule)},
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)},
  {path: '**', redirectTo: 'contac'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]

})
export class AppRoutingModule {

}
