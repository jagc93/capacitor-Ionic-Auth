import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPoliciesPageRoutingModule } from './privacy-policies-routing.module';

import { PrivacyPoliciesPage } from './privacy-policies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPoliciesPageRoutingModule
  ],
  declarations: [PrivacyPoliciesPage]
})
export class PrivacyPoliciesPageModule {}
