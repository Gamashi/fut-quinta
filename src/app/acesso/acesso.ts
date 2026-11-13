import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importando o "GPS" do Angular

@Component({
  selector: 'app-acesso',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acesso.html',
})
export class Acesso {
  nomeJogador: string = '';
  whatsappJogador: string = '';

  // Injetando o Router via construtor (igualzinho no C#)
  constructor(private router: Router) {}

  entrarNaFila() {
    // Validação simples para não deixar entrar vazio
    if (!this.nomeJogador.trim() || !this.whatsappJogador.trim()) {
      alert('Preencha seu nome e WhatsApp para garantir a vaga!');
      return;
    }

    // Apenas para vermos no console (F12) que capturou certo
    console.log('Jogador pronto:', this.nomeJogador);
    console.log('Contato:', this.whatsappJogador);

    // O comando que faz a mágica de trocar de tela sem recarregar a página
    this.router.navigate(['/fila']);
  }
}