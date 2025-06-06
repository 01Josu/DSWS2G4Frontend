import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIncidenciaComponent } from './detalle-incidencia.component';

describe('DetalleIncidenciaComponent', () => {
  let component: DetalleIncidenciaComponent;
  let fixture: ComponentFixture<DetalleIncidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleIncidenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleIncidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
