import { Routes } from '@angular/router';
import { Acesso } from './acesso/acesso'; 
import { Fila } from './fila/fila';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', component: Acesso },
  { path: 'fila', component: Fila },
  { path: 'admin', component: Admin }
];