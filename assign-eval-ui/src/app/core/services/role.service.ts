// src/app/core/services/role.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '@app/models/project.model'; // Ensure correct path
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8088/api/v1/roles'; // Adjust based on your API

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  // Add other role-related methods if necessary
}
