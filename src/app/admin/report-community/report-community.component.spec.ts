import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCommunityComponent } from './report-community.component';

describe('ReportCommunityComponent', () => {
  let component: ReportCommunityComponent;
  let fixture: ComponentFixture<ReportCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportCommunityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
