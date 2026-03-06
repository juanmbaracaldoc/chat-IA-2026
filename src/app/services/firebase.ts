import { Injectable, inject } from "@angular/core";
import {Firestore, Timestamp, collection, addDoc, query, where, onSnapshot, DocumentData, QuerySnapshot} from '@angular/fire/firestore'
import { ConversacionChat, MensajeChat } from "../../models/chat";
import { Observable, map, onErrorResumeNextWith } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
   private firestore = inject(Firestore)
  
   // guardar mensaje 
  async guardarMensaje(mensaje: MensajeChat): Promise<void> {
    try {
      console.log('Guardando mensaje en Firestore:')
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
// filtrar que los mensajes que se muestras sean del usuario que esta autenticado 
  obtenerMensajesUsuario(usuarioId: string): Observable<MensajeChat[]> {
    return new Observable ( observer =>{

      const consulta =query(
        collection(this.firestore, 'mensajes'),
        where('usuarioId', "==", usuarioId)
      )
  const unSubscribe = onSnapshot(
    consulta,
    (snapshot: QuerySnapshot<DocumentData>)=>{
        const mensajes : MensajeChat[]= snapshot.docs.map( doc =>{
          const data = doc.data()
          return { 
            id: doc.id,
            usuarioId : data ['usuarioId'],
            contenido : data ['contenido'],
            estado : data['estado'],
            tipo : data['tipo'],
            // recordamos que firebase guarda TIMESTAMP y angular en date 
            fechaEnvio : data['fechaEnvio'].toDate()
          } as MensajeChat;
      });
      //ordenar los mensajes del mas reciente al mas antiguo
      mensajes.sort((a, b) => a.fechaEnvio.getTime() - b.fechaEnvio.getTime())

      observer.next(mensajes);
    },
    error =>{
      console.error('Error al escuchar los mensajes');
      observer.error(error);
    }
    );
    // se retorna una desubscripcion al servicio
    return () =>{
      unSubscribe;
    }
    });
    // gestionar obtener el id del ususario por medio de un mensaje   
    
  }
  

  // guardar conversacion
  async guardarConversacion(conversacion: ConversacionChat): Promise<void>{
    try{
      const collecionConversaciones = collection(this.firestore, 'conversaciones')
      // preparar las conversaciones para enviarlas a firestore
      const conversacionParaGuardar ={
        ...conversacion,
        fechaCreacion: Timestamp.fromDate(conversacion.fechaCreacion),
        ultimaActividad: Timestamp.fromDate(conversacion.ultimaActividad),
        // conversion del la fechaEnvio del MensajeChat
        mensajes: conversacion.mensajes.map(mensaje =>({
          ...mensaje,
          fechaEnvio: Timestamp.fromDate(mensaje.fechaEnvio)
        }))
      };
      await addDoc(collecionConversaciones, conversacionParaGuardar);

    }catch(error){
      console.error('error al guardar la conversacion', error)
      throw error;
    }
  }



}