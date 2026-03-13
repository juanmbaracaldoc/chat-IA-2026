import { Component, ViewChild, ElementRef, contentChild, inject, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { MensajeChat } from '../../../models/chat';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {

  private authService = inject(AuthService)
  private chatService = inject(ChatService)
  private router = inject(Router)

  //Referenciar contenedores
  @ViewChild('messagesContainer') messagesContainer! : ElementRef
  @ViewChild('mensajeInput') mensajeInput! :  ElementRef

  usuario: User|null = null;
  mensajes: MensajeChat[] =[]
  cargandoHistorial=false
  asistenteEscribiendo=false
  enviandoMensaje=false
  mensajeTexto=""
  mensajetextoError=""
  mensajeerror=""
  private debeHacerScroll:  boolean = false;

  private suscripciones : Subscription[] = []

  private async verificarAutenticacion(): Promise<void>{
    console.log('verificando autenticacion')
  // a la variable usuario le voy a asignar el servicio de auth y la funcion obtenerUsuario
  this.usuario = this.authService.obtenerUsuario()
  if (!this.usuario) {
    await this.router.navigate(['/auth'])
    throw Error('No hay un usuario autenticado')
  }
}
private async inicializarChat(): Promise<void>{
  console.log('ingreso a inicializar chat')
  if(!this.usuario){
    return; 
  }
this.cargandoHistorial = true;
try{
  console.log('antes de await')
  await this.chatService.InicializarChat(this.usuario.uid)
  console.log('después de await')
}catch(error){
  console.error('error al inicializar')
  throw error;
}finally{
  this.cargandoHistorial = false
}
}

  private configurarSubscripciones(): void{
    const subMensajes = this.chatService.mensajes$.subscribe( mensajes =>{
      this.mensajes = mensajes,
      this.debeHacerScroll = true;
    });

    const subMensajesAsis = this.chatService.asistenteRespondiendo$.subscribe( respondiendo =>{
      this.asistenteEscribiendo = respondiendo;
      if(respondiendo){
        this.debeHacerScroll = true
      }
    });

    this.suscripciones.push(subMensajes, subMensajesAsis)
  }
  async enviarMensaje(): Promise<void>{
    if(!this.mensajeTexto.trim()){
      return;
    }

    this.mensajeerror=""
    this.enviandoMensaje = true;
    // es guardando el mensaje en la variable 
    const texto = this.mensajeTexto.trim()
    // limpiar el input
    this.mensajeTexto="";

    try{
      await this.chatService.enviarMensaje(texto)
      this.enfocarInput()     
    }catch(error: any){
      console.error('error al enviar el mensaje', error)
      this.mensajeerror = error.message || 'Error al enviar el mensaje'
      this.mensajeTexto = texto;
    }finally{
      this.enviandoMensaje = false;
    }
}


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




  manejoErrorimagen(event: any): void{
    event.target.src = 'https://www.reddit.com/r/settmains/comments/15s5n79/new_sett_icon/?tl=es-es'
  }


  trackByMensaje( index:number, mensaje: MensajeChat){
return mensaje.id = `${mensaje.tipo} - ${mensaje.fechaEnvio.getTime()}`

  }

mensajeTeclaPresionada(event:KeyboardEvent){
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    this.enviarMensaje();
  }
}
async cerrarSesion(): Promise <void>{
  try{
    this.chatService.limpiarChat();

    await this.authService.cerrarSesion();
    await this.router.navigate(['/auth']);


  }catch(error){
    console.error('error al cerrar sesion')
    this.mensajeerror = 'Error al cerrar sesión. Por favor, intenta nuevamente.'
    throw error;
  }

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

async ngOnInit(): Promise <void>{
  try{
  await this.verificarAutenticacion();
  await this.inicializarChat();
  this.configurarSubscripciones();
  }catch(error){
  console.error('error al inicializar el chat ngOnInit', error)
  this.mensajeerror = 'Error al inicializar el chat. Por favor, intenta nuevamente.'
  throw error;
  }
}
  ngOnDestroy(): void{
    this.suscripciones.forEach(sub => sub.unsubscribe())
  }
  


private enfocarInput(): void{
  setTimeout(() => {
    this.mensajeInput.nativeElement.focus();
  }, 100);
}
}