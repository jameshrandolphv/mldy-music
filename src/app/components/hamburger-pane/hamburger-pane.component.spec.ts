import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerPaneComponent } from './hamburger-pane.component';

describe('HamburgerPaneComponent', () => {
  let component: HamburgerPaneComponent;
  let fixture: ComponentFixture<HamburgerPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgerPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgerPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
