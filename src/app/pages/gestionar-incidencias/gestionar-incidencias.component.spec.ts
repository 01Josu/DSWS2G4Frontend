import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarIncidenciasComponent } from './gestionar-incidencias.component';

describe('GestionarIncidenciasComponent', () => {
  let component: GestionarIncidenciasComponent;
  let fixture: ComponentFixture<GestionarIncidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarIncidenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
