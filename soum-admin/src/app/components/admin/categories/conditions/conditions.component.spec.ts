import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { ConditionsComponent } from './conditions.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let tableRow: any;
  let fixture: ComponentFixture<ConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConditionsComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule.forRoot({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsComponent);
    component = fixture.componentInstance;
  });

  it('should create conditions component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct table row', () => {
    component.conditions = true;
    fixture.detectChanges();

    tableRow = fixture.nativeElement.querySelector('tbody tr');
    expect(tableRow).toBeTruthy();
  });

  it('Should we have Like New Row For Conditions ', () => {
    component.conditions = true;
    fixture.detectChanges();
    tableRow = fixture.nativeElement.querySelector('tbody tr');
    const LikeNewCondition = tableRow.querySelector('.td1');
    expect(LikeNewCondition.textContent).toContain('Like New');
  });
});
