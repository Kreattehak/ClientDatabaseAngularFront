import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PathNotFoundComponent} from '../../app/utils/path-not-found.component';

describe('PathNotFoundComponent', () => {
  let component: PathNotFoundComponent;
  let fixture: ComponentFixture<PathNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PathNotFoundComponent
      ],
    });
    fixture = TestBed.createComponent(PathNotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create the PathNotFoundComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have properly created template', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).toContain('Path not found!');
  });
});
