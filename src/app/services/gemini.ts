import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


interface PeticionGemini{
  contents: ContentGemini[]; // vamos a cambiar por otra interface
  generationConfig?:{
    maxOuputTonkens?:number;
    temperature?:number
  }
  safetySettings: SafetySetting[];
}

interface ContentGemini{
  role: 'user' | 'model';
  parts: PartGemini[] ; 
}

interface PartGemini{
  text: string;
}

interface SafetySetting{
  category: string;
  threshold: string
}

interface RespuestaGemini{
  candidate:{
    content:{
      part:{
        text: string;
      }[];
    };
    finishReason: string
  }[];
  usageMetaData?:{
    promtTokenCount:number;
    candidateTokenCount:number;
    totalTokenCount: number
  };
}



@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  //inyecciones de dependecias
   private http = inject(HttpClient)

  //variabels que llevan la url
  private apiURL = environment.gemini.apiURL
  private apiKey = environment.gemini.apiKey

   enviarMensaje(mensaje: string, HitorialPrevio: ContentGemini[]=[]): Observable<string>{
    //verificar si la URL esta bien confiigurada
    if(!this.apiKey || this.apiKey === 'Tu_api__key_de_gemini'){
      console.error('Error la api key no esta configurada')
      return throwError(()=> new Error ('Api de gemini no configurada correctamente'))
    }

    const headres = new HttpHeaders({
      'Content-Type': 'aplication/json'
    })

    // vamos a enviar un mensaje al contenido del sistema
    const mensajeSistema: ContentGemini={
      role: 'user',
      parts:[{
        text: "Eres un asistente virtual util y amigable, responde siempre en español y con acento paisa de manera concisa. Eres especialista en preguntas generales y sobretodo en programacion de Software. Manten un tono Profesional y jugueton y cercano"
      }]
    }

    const respuestaSistema: ContentGemini={
      role: 'model',
      parts : [{
        text: 'Entendido parce, Soy tu asistente virtual Especializado en programacion de software, y te contestare de la forma mas chimba y en españo para que me entendás ¿en que puedo colaborarte hoy Parcer@?'
      }]
    }
  }
}
