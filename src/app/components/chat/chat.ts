import { Component, ViewChild, ElementRef, contentChild } from '@angular/core';
import { MensajeChat } from '../../../models/chat';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  nombre:string="Juan Manuel Baracaldo"
  email:string="juanm.baracaldoc@gmail.com"
  mensajes: MensajeChat[] =[]
  cargandoHistorial=false
  asistenteEscribiendo=false
  enviandoMensaje=false
  mensajeTexto=""
  mensajetextoError=""
  mensajeerror="No se pudo enviar su mensaje"
  private debeHacerScroll=true

  //Referenciar contenedores
  @ViewChild('messagesContainer') messagesContainer! : ElementRef

  private scrollHaciaAbajo():void{
    try{
        const container = this.messagesContainer?.nativeElement
        if(container){
          container.scrollTop = container.scrollHeight
          
        }
    }catch(error){
      console.error('✖️Error al hacer scroll', error)

    }
  }
  ngAfterViewChecked():void{
    if(this.debeHacerScroll){
      this.scrollHaciaAbajo();
      this.debeHacerScroll=false
    }

  }




  manejoErrorimagen(){

  }
  cerrarSesion(){}

  trackByMensaje( index:number, mensaje: MensajeChat){
}
mensajeTeclaPresionada(event:KeyboardEvent){

}
  formatearMensajeAsistente(contenido:string){
    
    return contenido
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
  }


  formatearHora(fecha: Date): string{
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })

  }
enviarMensaje(){

}
ngOnInit(){
 this.mensajes = this.generarMensajeDemo()
}



  private generarMensajeDemo(): MensajeChat[]{
    const ahora = new Date();
    return [
      {
        id: '1',
        contenido: 'Hola eres el asistente?',
        tipo: 'usuario',
        fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'usuario1'
      }, {
        id: '2',
        contenido: 'Hola Juan Manuel, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        tipo: 'asistente',
         fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'asistente1'

      },{
        id: '3',
        contenido: '¿Puedes decirme el clima de hoy?',
        tipo: 'usuario',
         fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'usuario1'
      },{
        id: '4',
        contenido: 'Claro, el clima de hoy en tu ubicación es soleado con una temperatura de 25°C.',
        tipo: 'asistente',
         fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'asistente1'
      },{
        id: '5',
        contenido: '¿Puedes recomendarme un restaurante cercano?',
        tipo: 'usuario',
         fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'usuario1'
      },{
        id: '6',
        contenido: 'Por supuesto, hay un restaurante italiano llamado "La Trattoria" a 500 metros de tu ubicación. ¿Quieres que te dé más detalles?',
        tipo: 'asistente',
        fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'asistente1'
      },{
        id: '7',
        contenido: 'Sí, por favor.',
        tipo: 'usuario',
    fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'usuario1'
      },{
        id: '8',
        contenido: 'La Trattoria ofrece una variedad de platos italianos, tiene una calificación de 4.5 estrellas y está abierto hasta las 10 PM.',
        tipo: 'asistente',
         fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'asistente1'
      },{
        id: '9',
        contenido: '¡Gracias por la información!',
        tipo: 'usuario',
       fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'usuario1'
      },{
        id: '10',
        contenido: 'De nada, Juan Manuel. Si necesitas algo más, no dudes en preguntar.',
        tipo: 'asistente',
        fechaEnvio: new Date(ahora.getTime()),
        estado: 'enviado',
        usuarioId: 'asistente1'
      }
    ];
  }


}