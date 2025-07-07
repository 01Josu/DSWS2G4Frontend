import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardJefeTecnicoComponent } from './dashboard-jefe-tecnico.component';

describe('DashboardJefeTecnicoComponent', () => {
  let component: DashboardJefeTecnicoComponent;
  let fixture: ComponentFixture<DashboardJefeTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardJefeTecnicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardJefeTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
