import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../../shared/types/user.type';
import { API_URL } from '../../../shared/constants/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    this.checkAuthStatus();
  }
  private currentUserSignal = signal<User | null | undefined>(undefined);
  public currentUser = computed(() => this.currentUserSignal());
  public isLoggedIn = computed(() => !!this.currentUserSignal());

  baseCookieOptions: CookieOptions = {
    path: '/',
    secure: false, //should be true in prod,
    sameSite: 'Lax',
  };

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  login(
    data: {
      username: string;
      password: string;
    },
    rememberMe: boolean
  ): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${API_URL}/auth/sign-in`, data)
      .pipe(
        tap((response) =>
          this.handleAuthentication(response.accessToken, rememberMe)
        ),
        catchError((error) => {
          console.error('Login failed:', error);
          this.clearAuthData();
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  private checkAuthStatus(): void {
    const token = this.cookieService.get('accessToken');
    if (!token) return this.currentUserSignal.set(null);
    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const isExpired = decodedToken.exp
        ? decodedToken.exp * 1000 < Date.now()
        : true;

      if (!isExpired) {
        this.currentUserSignal.set({
          id: decodedToken.sub ?? '',
          username: decodedToken.username,
        });
      } else {
        this.clearAuthData();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.clearAuthData();
    }
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private handleAuthentication(token: string, rememberMe: boolean): void {
    try {
      let currentCookieOptions: CookieOptions = { ...this.baseCookieOptions };
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      if (rememberMe && decodedToken.exp) {
        const expiryDate = new Date(decodedToken.exp * 1000);
        currentCookieOptions.expires = expiryDate;
      } else {
        currentCookieOptions.expires = undefined;
      }

      this.cookieService.set('accessToken', token, currentCookieOptions);
      this.currentUserSignal.set({
        id: decodedToken.userId,
        username: decodedToken.username,
      });
    } catch (err) {
      console.log(err);
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    this.cookieService.delete(
      'accessToken',
      this.baseCookieOptions.path,
      this.baseCookieOptions.domain,
      this.baseCookieOptions.secure,
      this.baseCookieOptions.sameSite
    );
    this.currentUserSignal.set(null);
  }
}
