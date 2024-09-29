import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingsComponent {

  objects:{
    results:[],
    count:number
  }
  ={
    results:[],
    count : 0
  }

  searchValue = ''
  add(){

  }

  refresh(){

  }

}
