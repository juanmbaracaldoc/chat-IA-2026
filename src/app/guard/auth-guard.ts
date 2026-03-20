import { CanActivateFn, Router, ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject, Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class authGuard implements CanActivate {

  private AuthService = inject(AuthService);
  private router = inject(Router)
  
  canActivate(): Observable<boolean> {
    return this.AuthService.estaAutenticado$.pipe(
      tap(estaAutenticado => {
        if (!estaAutenticado) {
          console.log('acceso denegado')
          this.router.navigate(['/auth'])
        } else {
          console.log("acceso permitido")
        }
      }
      
      ),
      map(estaAutenticado => estaAutenticado)
    );
  }

};
