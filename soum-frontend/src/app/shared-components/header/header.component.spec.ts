import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.showBackBtn = true;
    component.pageTitle = 'Profile';
    component.action = 'Cancel';
    component.actionStyle = 'actionStyleClass';
    fixture.detectChanges();
  });

  it('should create Header Component', () => {
    expect(component).toBeTruthy();
  });

  it('check page have back button', () => {
    expect(component.showBackBtn).toBeTrue();
  });

  it('header should have title', () => {
    expect(component.pageTitle).toEqual('Profile');
  });

  it('header mayBe have Action, cancel or Notification', () => {
    expect(component.action).toEqual('Cancel');
  });

  it('header mayBe have action style', () => {
    expect(component.actionStyle).toEqual('actionStyleClass');
  });

  it('check title of header component from Dom', () => {
    expect(
      fixture.nativeElement.querySelector('.product-title').innerText
    ).toEqual(component.pageTitle);
  });

  it('check header have action beside the back button', () => {
    expect(
      fixture.nativeElement.querySelector('.headerAction').innerText
    ).toEqual(component.action);
  });
});
