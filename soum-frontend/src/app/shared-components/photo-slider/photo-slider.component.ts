import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-slider',
  templateUrl: './photo-slider.component.html',
  styleUrls: ['./photo-slider.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition('* => void', [animate('300ms', style({ opacity: 0 }))])
    ])
  ]
})
export class PhotoSliderComponent implements OnInit {
  slides: any = [];
  currentSlide = 0;

  constructor(
    public dialogRef: MatDialogRef<PhotoSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.slides = this.data;
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 2 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length - 1 ? 0 : next;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
