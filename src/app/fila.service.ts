import { Injectable } from '@angular/core';

export interface Jogador {
  nome: string;
  whatsapp: string;
  posicao: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  jogadoresConfirmados: Jogador[] = [];
  limiteVagas = 12;

  // NOVO: Uma "sala de espera" para guardar os dados entre a tela 1 e a tela 2
  jogadorAtual: { nome: string, whatsapp: string } | null = null;

  constructor() { }

  // Método para a Tela de Acesso apenas guardar quem está entrando
  setJogadorAtual(nome: string, whatsapp: string) {
    this.jogadorAtual = { nome, whatsapp };
  }

  // Método para a Tela da Fila efetivar a vaga
  adicionarJogador(jogador: Jogador) {
    this.jogadoresConfirmados.push(jogador);
  }

  obterJogadores() {
    return this.jogadoresConfirmados;
  }
}