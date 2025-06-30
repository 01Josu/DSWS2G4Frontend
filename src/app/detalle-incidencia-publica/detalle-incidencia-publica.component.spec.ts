import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIncidenciaPublicaComponent } from './detalle-incidencia-publica.component';

describe('DetalleIncidenciaPublicaComponent', () => {
  let component: DetalleIncidenciaPublicaComponent;
  let fixture: ComponentFixture<DetalleIncidenciaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleIncidenciaPublicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleIncidenciaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
