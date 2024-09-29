import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Building } from '../../../models/Building';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-building-dialog',
  standalone: true,
  imports: [ TranslateModule,
             
   ],
  templateUrl: './building-dialog.component.html',
  styleUrl: './building-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingDialogComponent {

  constructor(
    public dynamicDialogRef: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig<{
      obj: Building
    }>
    
  ){}
}
