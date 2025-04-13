import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/types/user.type';
import { API_URL } from '../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(data: {
    username: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${API_URL}/auth/sign-in`,
      data
    );
  }
}
