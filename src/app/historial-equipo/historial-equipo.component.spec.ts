import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialEquipoComponent } from './historial-equipo.component';

describe('HistorialEquipoComponent', () => {
  let component: HistorialEquipoComponent;
  let fixture: ComponentFixture<HistorialEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
