import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-category',
  templateUrl: './question-category.component.html',
  styleUrls: ['./question-category.component.scss']
})
export class QuestionCategoryComponent implements OnInit {
@Input() tiles;
@Input() title; 
@Input() icon;
showTiles = false;
  constructor() { }

  ngOnInit(): void {
  }

  openTiles(){
this.showTiles = true;
  }

}
