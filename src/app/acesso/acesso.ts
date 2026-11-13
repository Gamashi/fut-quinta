import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilaService } from '../fila.service'; 

@Component({
  selector: 'app-acesso',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acesso.html',
})
export class Acesso {
  nomeJogador: string = '';
  whatsappJogador: string = '';

  constructor(private router: Router, private filaService: FilaService) {}

  entrarNaFila() {
    if (!this.nomeJogador.trim() || !this.whatsappJogador.trim()) {
      alert('Preencha seu nome e WhatsApp para garantir a vaga!');
      return;
    }

    // CORREÇÃO: Apenas guarda os dados temporariamente, não coloca na lista ainda!
    this.filaService.setJogadorAtual(this.nomeJogador, this.whatsappJogador);

    this.router.navigate(['/fila']);
  }
}