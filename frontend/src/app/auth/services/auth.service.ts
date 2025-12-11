import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { User } from '../../user/models';

interface AuthResponse {
  accessToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

type DecodedToken = JwtPayload & User;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private readonly TOKEN_KEY = 'accessToken';

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user = signal<User | null>(this.decodeUserFromToken());

  public login(data: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap((response) => {
        this.storeToken(response.accessToken);
        this.setUserFromToken();
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  public isLoggedIn(): boolean {
    const isValid = this.hasValidToken();

    if (this.isAuthenticatedSubject.value !== isValid) {
      this.isAuthenticatedSubject.next(isValid);
    }

    return isValid;
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.user.set(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public decodeUserFromToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const { id, email, firstName, lastName, role }: DecodedToken = jwtDecode(token);
      return new User({ id, email, firstName, lastName, role });
    } catch (error) {
      this.logout();
      return null;
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUserFromToken() {
    this.user.set(this.decodeUserFromToken());
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp! * 1000;
      const currentTime = new Date().getTime();

      return currentTime < expirationTime;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}
