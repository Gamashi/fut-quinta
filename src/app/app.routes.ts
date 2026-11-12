import { Routes } from '@angular/router';
import { Acesso } from './acesso/acesso'; 
import { Fila } from './fila/fila';

export const routes: Routes = [
  { path: '', component: Acesso },
  { path: 'fila', component: Fila }
];