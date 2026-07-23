import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './pages/admin-page.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [AdminPageComponent],
  imports: [CommonModule, MaterialModule, AdminRoutingModule],
})
export class AdminModule {}