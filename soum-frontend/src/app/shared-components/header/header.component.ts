import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showBackBtn = true;
  @Input() pageTitle;
  @Input() action;
  @Input() actionStyle;
  @Input() titleStyle;
  @Output() goBack = new EventEmitter<any>();
  @Output() actionEvent = new EventEmitter<any>();

  navigateTo() {
    this.goBack.emit();
  }

  fireActionEvent() {
    this.actionEvent.emit();
  }
}
