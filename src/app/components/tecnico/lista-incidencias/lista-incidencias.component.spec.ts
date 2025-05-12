import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIncidenciasComponent } from './lista-incidencias.component';

describe('ListaIncidenciasComponent', () => {
  let component: ListaIncidenciasComponent;
  let fixture: ComponentFixture<ListaIncidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaIncidenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
