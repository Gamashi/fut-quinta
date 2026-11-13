import { Injectable } from '@angular/core';

export interface Jogador {
  nome: string;
  whatsapp: string;
  posicao: string; // 'linha' ou 'goleiro'
}

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  jogadoresConfirmados: Jogador[] = [];
  jogadoresEspera: Jogador[] = [];
  
  // Limites separados por posição
  limiteLinha = 10;
  limiteGoleiro = 2;
  
  jogadorAtual: { nome: string, whatsapp: string } | null = null;

  constructor() { }

  setJogadorAtual(nome: string, whatsapp: string) {
    this.jogadorAtual = { nome, whatsapp };
  }

  adicionarJogador(jogador: Jogador) {
    // 1. Conta quantos jogadores dessa MESMA posição já estão confirmados
    const qtdNaPosicao = this.jogadoresConfirmados.filter(j => j.posicao === jogador.posicao).length;
    
    // 2. Define qual é o limite aplicável para este jogador
    const limite = jogador.posicao === 'goleiro' ? this.limiteGoleiro : this.limiteLinha;

    // 3. Se ainda tem cota para a posição dele, entra na principal. Se não, vai pra espera.
    if (qtdNaPosicao < limite) {
      this.jogadoresConfirmados.push(jogador);
    } else {
      this.jogadoresEspera.push(jogador);
    }
  }

  obterJogadores() {
    return this.jogadoresConfirmados;
  }

  obterEspera() {
    return this.jogadoresEspera;
  }

// NOVO: Retorna exatamente em qual lista o celular foi encontrado
  obterStatusJogador(whatsapp: string): 'confirmado' | 'espera' | null {
    if (this.jogadoresConfirmados.some(j => j.whatsapp === whatsapp)) {
      return 'confirmado';
    }
    if (this.jogadoresEspera.some(j => j.whatsapp === whatsapp)) {
      return 'espera';
    }
    return null; // Não está em nenhuma, ou seja, ainda não tentou garantir a vaga
  }
}