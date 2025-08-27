import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-tile',
  templateUrl: './question-tile.component.html',
  styleUrls: ['./question-tile.component.scss']
})
export class QuestionTileComponent implements OnInit {
@Input() tile; 
language = 'ar';
panelOpenState = false;
  ngOnInit() {
    this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang'))) || 'ar';
  }
}
