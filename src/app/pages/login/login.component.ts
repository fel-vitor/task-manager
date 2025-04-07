import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonXsDirective } from 'src/app/shared/directives/button/button.directive';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthStoreService } from 'src/app/shared/stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonXsDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  route = inject(Router);
  authStoreService = inject(AuthStoreService);

  showAuthFailedMessage = signal(false);

  form: FormGroup = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email as string;
    const password = this.form.value.password as string;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.authStoreService.setAsLoggedIn();
        this.route.navigateByUrl('/');
      },
      error: () => {
        this.showAuthFailedMessage.set(true);
      },
    });
  }
}
