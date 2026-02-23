import { Injectable, inject } from '@angular/core';
import { Auth, user, User} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario';
import {GoogleAuthProvider} from 'firebase/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private auth = inject(Auth);

  //variable de tipo observable

  usuario$ = user(this.auth);

  estaAutenticado$b = this.usuario$.pipe(
    map((usuario) => !!usuario)
  );

  //metodo para iniciar sesion con google
  async iniciarSesionGoogle(): Promise< Usuario | null> {
    try {
      const provider = new GoogleAuthProvider();

      // controladores
      provider.addScope('email');
      provider.addScope('profile');

      const resultado = await signInWithPopup(this.auth, provider);
      const usuarioFirebase = resultado.user;

      if(usuarioFirebase){
        const usuario: Usuario = {
          uid: usuarioFirebase.uid,
          nombre: usuarioFirebase.displayName || 'Usuario sin nombre',
          email: usuarioFirebase.email || '',
          fotoUrl: usuarioFirebase.photoURL || undefined,
          fechaCreacion: new Date,
          ultimaConexion: new Date,
      }
      return usuario;
    }
    return null;
  }catch(error){
    console.error('Error al iniciar sesión con Google')
    throw error;
   }
  } 

  obtenerUsuario(): User | null {
    return this.auth.currentUser;
  }

  // cerrar sesion
  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      throw error;
    }
  }


}