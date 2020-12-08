import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OneComponent } from './one/one.component';
import { TwoComponent } from './two/two.component';
import { ThreeComponent } from './three/three.component';

const routes: Routes = [
  {
    path: 'one',
    component: OneComponent
  },
  {
    path: 'two',
    component: TwoComponent
  },
  {
    path: 'three',
    component: ThreeComponent
  },
  {
    path: '**',
    redirectTo: 'one'
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' });
