import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApartmentsComponent {

}
