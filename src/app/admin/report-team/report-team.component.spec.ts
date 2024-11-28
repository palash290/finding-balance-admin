import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTeamComponent } from './report-team.component';

describe('ReportTeamComponent', () => {
  let component: ReportTeamComponent;
  let fixture: ComponentFixture<ReportTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
