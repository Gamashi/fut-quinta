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
  // A lista com os dados reais que vem do serviço
  listaJogadores: Jogador[] = []; 
  
  // Os arrays estruturais para desenhar os 17 espaços na tela
  vagasConfirmadas = new Array(12);
  listaEspera = new Array(5);

  posicaoSelecionada: string = 'linha';
  dataDoProximoJogo: string = '';

  constructor(private filaService: FilaService) {}

  ngOnInit() {
    this.calcularProximaQuinta();
    
    // Puxando os jogadores salvos na memória
    this.listaJogadores = this.filaService.obterJogadores();
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
    // Puxa os dados que a tela de Acesso deixou salvos na memória
    const dadosTemporarios = this.filaService.jogadorAtual;

    // Se os dados existirem (o usuário não burlou a tela de acesso)
    if (dadosTemporarios) {
      
      // Agora sim, efetiva a vaga na lista oficial!
      this.filaService.adicionarJogador({
        nome: dadosTemporarios.nome,
        whatsapp: dadosTemporarios.whatsapp,
        posicao: this.posicaoSelecionada // Junta com a escolha de Linha/Goleiro
      });

      // Opcional: limpa os dados temporários para evitar duplicação de cliques
      this.filaService.jogadorAtual = null;

      // Atualiza a lista exibida na tela
      this.listaJogadores = this.filaService.obterJogadores();
      
      alert('Vaga garantida com sucesso!');
    } else {
      alert('Erro: Volte para a tela inicial e preencha seus dados.');
    }
  }
}