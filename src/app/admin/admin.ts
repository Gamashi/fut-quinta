import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilaService, Jogador } from '../fila.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  senhaDigitada: string = '';
  estaAutenticado: boolean = false;
  
  listaConfirmados: Jogador[] = [];
  listaEspera: Jogador[] = [];

  constructor(
    private filaService: FilaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Mantemos o rádio ligado. Se alguém entrar na fila, o painel admin atualiza ao vivo!
    this.filaService.escutarMudancasEmTempoReal(() => {
      this.atualizarListas();
    });
  }

  async entrar() {
    // Senha simples (você pode mudar para a que quiser)
    if (this.senhaDigitada === 'futquinta2024') {
      this.estaAutenticado = true;
      await this.carregarDados();
    } else {
      alert('Senha incorreta!');
      this.senhaDigitada = '';
    }
  }

  async carregarDados() {
    await this.filaService.carregarJogadoresDaNuvem();
    this.atualizarListas();
  }

  atualizarListas() {
    this.listaConfirmados = this.filaService.obterJogadores();
    this.listaEspera = this.filaService.obterEspera();
    this.cdr.detectChanges();
  }

  async removerJogador(jogador: Jogador) {
      // Confirmação para evitar cliques acidentais
      const confirmacao = confirm(`Tem certeza que deseja remover ${jogador.nome} da lista?`);
      
      if (confirmacao) {
        const sucesso = await this.filaService.removerJogadorBanco(jogador.whatsapp);
        
        if (sucesso) {
          // Se deu certo, atualiza a tela do admin imediatamente
          this.atualizarListas();
        }
      }
    }
}