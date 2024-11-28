import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCoachComponent } from './sub-coach.component';

describe('SubCoachComponent', () => {
  let component: SubCoachComponent;
  let fixture: ComponentFixture<SubCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubCoachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
