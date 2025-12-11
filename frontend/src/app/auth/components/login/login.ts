import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MessageModule,
    ToastModule,
    DividerModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  public isLoading = signal(false);
  public isAuthenticated = toSignal(this.authService.isAuthenticated$, { initialValue: false });
  public errorMessage = signal<string | null>(null);
  public loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public isFormInvalid = computed(() => this.loginForm.invalid);

  public get f() {
    return this.loginForm.controls;
  }

  isInvalidFormControl(controlName: string): boolean | undefined {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }

  public onSubmit(): void {
    if (this.isFormInvalid()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error.error?.message ?? 'Invalid credentials',
        });
      },
    });
  }
}
