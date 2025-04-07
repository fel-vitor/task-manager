import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonXsDirective } from 'src/app/shared/directives/button/button.directive';
import { LoginFacadeService } from 'src/app/shared/services/login-facade/login-facade.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonXsDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  route = inject(Router);
  loginFacadeService = inject(LoginFacadeService);

  showAuthFailedMessage = signal(false);

  form: FormGroup = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
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

    this.loginFacadeService.login(email, password).subscribe({
      next: () => {
        this.route.navigateByUrl('/');
      },
      error: () => {
        this.showAuthFailedMessage.set(true);
      },
    });
  }
}
