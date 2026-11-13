import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilaService, Jogador } from '../fila.service';

@Component({
  selector: 'app-fila',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fila.html',
})
export class Fila implements OnInit {
  listaJogadores: Jogador[] = []; 
  listaJogadoresEspera: Jogador[] = []; // NOVA: Recebe os dados reais da espera
  
  vagasConfirmadas = new Array(12);
  listaEspera = new Array(5); // Mantemos para desenhar os 5 espaços vazios
  
  posicaoSelecionada: string = 'linha';
  dataDoProximoJogo: string = '';
  jaEstaNaFila: boolean = false;

// AGORA É UMA STRING QUE GUARDA O ESTADO REAL DO USUÁRIO
  statusFila: 'confirmado' | 'espera' | null = null;

  constructor(private filaService: FilaService) {}

  ngOnInit() {
    this.calcularProximaQuinta();
    this.listaJogadores = this.filaService.obterJogadores();
    this.listaJogadoresEspera = this.filaService.obterEspera();

    // Quando a tela abre, descobre onde o cara tá
    const atual = this.filaService.jogadorAtual;
    if (atual) {
      this.statusFila = this.filaService.obterStatusJogador(atual.whatsapp);
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

confirmarVaga() {
    const dadosTemporarios = this.filaService.jogadorAtual;

    if (dadosTemporarios && !this.statusFila) {
      // Manda pro serviço decidir (ele vai checar a cota de linha/goleiro)
      this.filaService.adicionarJogador({
        nome: dadosTemporarios.nome,
        whatsapp: dadosTemporarios.whatsapp,
        posicao: this.posicaoSelecionada 
      });

      this.listaJogadores = this.filaService.obterJogadores();
      this.listaJogadoresEspera = this.filaService.obterEspera();
      
      // Imediatamente após clicar, ele lê o resultado (se coube ou transbordou)
      this.statusFila = this.filaService.obterStatusJogador(dadosTemporarios.whatsapp); 
    }
  }
}