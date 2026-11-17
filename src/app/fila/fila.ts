// 1. Importe o ChangeDetectorRef do núcleo do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilaService, Jogador } from '../fila.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fila',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fila.html',
})
export class Fila implements OnInit {
  listaJogadores: Jogador[] = []; 
  listaJogadoresEspera: Jogador[] = [];
  vagasConfirmadas = new Array(12);
  listaEspera = new Array(5);
  posicaoSelecionada: string = 'linha';
  dataDoProximoJogo: string = '';
  statusFila: 'confirmado' | 'espera' | null = null;
  carregando: boolean = true; // NOVA: Começa travado

  constructor(
    private filaService: FilaService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

async ngOnInit() {

    // SE DER F5 E PERDER A MEMÓRIA, VOLTA PRA TELA INICIAL
    if (!this.filaService.jogadorAtual) {
      this.router.navigate(['/']); // ou ['/acesso'] dependendo de como está sua rota
      return; // Para a execução do resto do código
    }

    this.calcularProximaQuinta();
    
    // O try/finally GARANTE que a tela não vai ficar travada eternamente
    try {
      this.carregando = true;
      this.cdr.detectChanges(); // Força a tela a mostrar o loading
      
      // 1. PRIMEIRO: Baixa a lista completa de dados do Supabase
      await this.filaService.carregarJogadoresDaNuvem();
      
      this.listaJogadores = this.filaService.obterJogadores();
      this.listaJogadoresEspera = this.filaService.obterEspera();

      const atual = this.filaService.jogadorAtual;
      if (atual) {
        this.statusFila = this.filaService.obterStatusJogador(atual.whatsapp);
      }
      
      // 2. SEGUNDO: Só depois que a tela montou, a gente liga o tempo real
      this.filaService.escutarMudancasEmTempoReal(() => {
        this.listaJogadores = this.filaService.obterJogadores();
        this.listaJogadoresEspera = this.filaService.obterEspera();
        this.cdr.detectChanges(); 
      });

    } catch (erro) {
      console.error('Erro ao montar a fila:', erro);
    } finally {
      // 3. TERCEIRO: Dando erro ou sucesso, libera a tela!
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  calcularProximaQuinta() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();
    let diasAteQuinta = 4 - diaDaSemana;
    if (diasAteQuinta < 0) {
      diasAteQuinta += 7; 
    }
    const proximaQuinta = new Date(hoje);
    proximaQuinta.setDate(hoje.getDate() + diasAteQuinta);
    
    const dia = proximaQuinta.getDate().toString().padStart(2, '0');
    const mes = (proximaQuinta.getMonth() + 1).toString().padStart(2, '0');
    
    this.dataDoProximoJogo = `${dia}/${mes}`;
  }

async confirmarVaga() {
    const dadosTemporarios = this.filaService.jogadorAtual;

    if (dadosTemporarios && !this.statusFila && !this.carregando) {
      this.carregando = true; // Trava o botão para não dar clique duplo
      this.cdr.detectChanges();
      
      const sucesso = await this.filaService.adicionarJogador({
        nome: dadosTemporarios.nome,
        whatsapp: dadosTemporarios.whatsapp,
        posicao: this.posicaoSelecionada 
      });

      if (sucesso) {
        this.statusFila = this.filaService.obterStatusJogador(dadosTemporarios.whatsapp); 
      }
      
      this.carregando = false; // Libera a tela
      this.cdr.detectChanges();
    }
  }
}