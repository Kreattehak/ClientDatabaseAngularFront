import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutAuthorComponent} from './about-author.component';

describe('AboutAuthorComponent', () => {
  let component: AboutAuthorComponent;
  let fixture: ComponentFixture<AboutAuthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AboutAuthorComponent
      ],
    });
    fixture = TestBed.createComponent(AboutAuthorComponent);
    component = fixture.componentInstance;
  });

  it('should create the AboutAuthorComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have properly created template', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('h1').textContent).toContain('Hello,');
    expect(compiled.querySelector('h2').textContent).toContain('secondary route');
    expect(compiled.querySelector('p').textContent).toContain('other projects');
    expect(compiled.querySelector('p').nextElementSibling.textContent).toContain('Kreattehak');
    expect(compiled.querySelector('a').href).toContain('https://github.com/Kreattehak');
  });
});
