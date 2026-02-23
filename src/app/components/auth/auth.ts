import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})


  export class Auth {
    autenticando=false
    mensajeError=""

      private authService = inject(AuthService)
      private router = inject(Router)

      //funcion que revise la autenticacion
      async iniciarsesioncongoogle (): Promise<void> {
        this.autenticando= true
        this.mensajeError=""

        try {
          //falta implementar el servicio

          //vamos a simular un usuario ya creado
          let usuario = null
          usuario = await new Promise ((resolve) =>{
            setTimeout(()=>resolve({nombre:'usuario de prueba'}), 1000)
        })

        if(usuario){
          await this.router.navigate(['/chat'])
        }else{
          this.mensajeError = "error al autenticar"
          console.error("error al autenticar en try")
        }

      } catch(error: any) {
      //validacion de algunos posibles errores
      if(error.code === "auth/popup.closed-by-user"){
        console.error('Error=Cerraste la ventana emergente')
      }else if(error.code === "auth/popup-blocked"){
        console.error('el navegador bloqueo la ventana emergente')
      }else if(error.code == 'auht/network-request-faild'){
        console.error('problemas con la conexion a internet')
      }
    }finally{
      this.autenticando= false
    }
  }
  /*
verificar que si el usuario ya es 
  ngOninit(){
    this.router.navigate(['/chat'])
  }*/
}


