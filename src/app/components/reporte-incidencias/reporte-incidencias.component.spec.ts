import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIncidenciasComponent } from './reporte-incidencias.component';

describe('NavbarComponent', () => {
  let component: ReporteIncidenciasComponent;
  let fixture: ComponentFixture<ReporteIncidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteIncidenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
