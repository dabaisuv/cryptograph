import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';



import { EncryptionAlgorithmComponent } from './encryption-algorithm.component';
import { PlayfairComponent } from './playfair/playfair.component';
import { DESComponent } from './des/des.component';




@NgModule({
  declarations: [
    EncryptionAlgorithmComponent,
    PlayfairComponent,
    DESComponent
  ],
  exports: [
    EncryptionAlgorithmComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule

  ]
})
export class EncryptionAlgorithmModule { }
