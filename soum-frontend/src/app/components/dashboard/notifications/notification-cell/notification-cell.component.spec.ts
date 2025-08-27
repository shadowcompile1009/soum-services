import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCellComponent } from './notification-cell.component';

describe('NotificationCellComponent', () => {
  let component: NotificationCellComponent;
  let fixture: ComponentFixture<NotificationCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationCellComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
