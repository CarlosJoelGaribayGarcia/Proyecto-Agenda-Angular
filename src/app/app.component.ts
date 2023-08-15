import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url.includes('/login');
  }

  isToolbarHidden(): boolean {
    const childRoute = this.activatedRoute.snapshot.firstChild;
    return childRoute && childRoute.data.hideToolbar === true;
  }
}
