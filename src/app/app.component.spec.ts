import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolbarModule } from './components/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContacService } from './pages/contac/services/contac.service';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, ToolbarModule, HttpClientTestingModule],
    declarations: [AppComponent],
    providers: [
      { provide: ActivatedRoute, useValue: { snapshot: { firstChild: null } } },
      ContacService
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
