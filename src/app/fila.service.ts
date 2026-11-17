import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config';

export interface Jogador {
  nome: string;
  whatsapp: string;
  posicao: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  private supabase: SupabaseClient;
  private escutaAtiva = false;

  jogadoresConfirmados: Jogador[] = [];
  jogadoresEspera: Jogador[] = [];
  limiteLinha = 10;
  limiteGoleiro = 2;
  
  jogadorAtual: { nome: string, whatsapp: string } | null = null;

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.key);
  }

  setJogadorAtual(nome: string, whatsapp: string) {
    this.jogadorAtual = { nome, whatsapp };
  }

  // 1. NOVA FUNÇÃO: Puxa do banco e divide quem é titular e quem é espera
async carregarJogadoresDaNuvem() {
    const { data, error } = await this.supabase
      .from('fila_quinta')
      .select('*')
      .order('criado_em', { ascending: true });

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return;
    }

    // CORREÇÃO AQUI: Esvazia a lista sem quebrar a referência de memória do Angular!
    this.jogadoresConfirmados.length = 0;
    this.jogadoresEspera.length = 0;

    if (data) {
      for (let jogador of data) {
        const qtdNaPosicao = this.jogadoresConfirmados.filter(j => j.posicao === jogador.posicao).length;
        const limite = jogador.posicao === 'goleiro' ? this.limiteGoleiro : this.limiteLinha;

        if (qtdNaPosicao < limite) {
          this.jogadoresConfirmados.push(jogador);
        } else {
          this.jogadoresEspera.push(jogador);
        }
      }
    }
  }

  // 2. FUNÇÃO ATUALIZADA: Agora salva direto no Supabase
  async adicionarJogador(jogador: Jogador) {
    const { error } = await this.supabase
      .from('fila_quinta')
      .insert([{ 
        nome: jogador.nome, 
        whatsapp: jogador.whatsapp, 
        posicao: jogador.posicao 
      }]);

    if (error) {
          // 23505 é o código oficial do PostgreSQL para "Já existe esse dado (UNIQUE)"
          if (error.code === '23505') {
            alert('Caiu no anti-fraude! Este WhatsApp já garantiu vaga para esta semana.');
          } else {
            console.error('Erro ao inserir:', error);
            alert('Erro de conexão. Tente novamente.');
          }
          return false; // Retorna falso para destravar o botão na tela
        }

    // Após salvar, manda atualizar as listas recarregando da nuvem
    await this.carregarJogadoresDaNuvem();
    return true;
  }


  async removerJogadorBanco(whatsapp: string) {
    const { error } = await this.supabase
      .from('fila_quinta')
      .delete()
      .eq('whatsapp', whatsapp); // Deleta quem tiver esse número exato

    if (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao tentar remover o jogador.');
      return false;
    }

    // Após deletar, recarregamos as cotas locais
    await this.carregarJogadoresDaNuvem();
    return true;
  }

  obterJogadores() { return this.jogadoresConfirmados; }
  obterEspera() { return this.jogadoresEspera; }

  obterStatusJogador(whatsapp: string): 'confirmado' | 'espera' | null {
    if (this.jogadoresConfirmados.some(j => j.whatsapp === whatsapp)) return 'confirmado';
    if (this.jogadoresEspera.some(j => j.whatsapp === whatsapp)) return 'espera';
    return null;
  }
  // Adicione isso no final do seu fila.service.ts (antes de fechar a última chave da classe)
  
escutarMudancasEmTempoReal(avisoParaAtualizarATela: () => void) {
    // Se o rádio já estiver ligado, não liga de novo para não duplicar!
    if (this.escutaAtiva) return;

    this.supabase
      .channel('fila_quinta_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fila_quinta' },
        async (payload) => {
          await this.carregarJogadoresDaNuvem(); 
          avisoParaAtualizarATela(); 
        }
      )
      .subscribe();
      
    // Marca que já ligamos o rádio
    this.escutaAtiva = true;
  }
}