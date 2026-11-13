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

  // Função que formata o número enquanto o usuário digita
  aplicarMascara(event: any) {
    // Remove tudo que não for número
    let valor = event.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos no máximo (2 do DDD + 9 do número)
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    // Monta a máscara visual: (XX) XXXXX-XXXX
    if (valor.length > 2) {
      valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
    }
    if (valor.length > 9) {
      valor = `${valor.substring(0, 10)}-${valor.substring(10)}`;
    }

    this.whatsappJogador = valor;
  }

  entrarNaFila() {
    // Valida se os campos estão preenchidos e se o WhatsApp tem o tamanho exato de 15 caracteres da máscara
    if (!this.nomeJogador.trim()) {
      alert('Preencha seu nome ou apelido!');
      return;
    }
    if (this.whatsappJogador.length !== 15) {
      alert('Digite um número de WhatsApp válido com DDD!');
      return;
    }

    this.filaService.setJogadorAtual(this.nomeJogador, this.whatsappJogador);
    this.router.navigate(['/fila']);
  }
}