import { Injectable, inject } from "@angular/core";
import {Firestore, Timestamp, collection, addDoc} from '@angular/fire/firestore'
import { MensajeChat } from "../../models/chat";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
   private firestore = inject(Firestore)
  
   // guardar mensaje
  async guardarMensaje(mensaje: MensajeChat): Promise<void> {
    try {
      // revisar si 
      if(!mensaje.usuarioId){
        //devuelvo que el mensaje debe tener un usuarioId
        throw new Error('El mensaje debe tener un usuarioId')
      }else if(!mensaje.contenido){
        //devuelvo que el mensaje debe tener un contenido
        throw new Error('El mensaje debe tener un contenido')
    }else if(!mensaje.tipo){
        //devuelvo que el mensaje debe tener un tipo
        throw new Error('El mensaje debe tener un tipo')
    }else if(!mensaje.fechaEnvio){
        //devuelvo que el mensaje debe tener una fecha de envio
        throw new Error('El mensaje debe tener una fecha de envio')
    }

      const coleccionMensaje = collection(this.firestore, 'mensajes')
      // preparar el mensaje
      const mensajeGuardar={
        usuarioId: mensaje.usuarioId,
        contenido: mensaje.contenido,
        tipo: mensaje.tipo,
        estado : mensaje.estado,
        // fecha es tipo timestamp y necesito pasarla a date
        fechaEnvio : Timestamp.fromDate(mensaje.fechaEnvio)
      };

      // añadir el mensaje a la coleccion, generar un documento en la coleccion
      const docRef = await addDoc(coleccionMensaje, mensajeGuardar)

      } catch(error: any){
        console.error('✖️ Error al guardar el mensaje en Firestore:', error)
        console.error('Error details:', {
          mensaje: error.message,
          code: error.code,
          stack: error.stack
      })
  
    }
  }

  obtenerMensajesUsuario(userId: int): Observable$ {
    // filtrar que los mensajes que se muestras sean del usuario que esta autenticado    
    
  }
}