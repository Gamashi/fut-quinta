import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fila',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fila.html',
})
export class Fila implements OnInit {
  vagasConfirmadas = new Array(12); 
  listaEspera = new Array(5);       
  posicaoSelecionada: string = 'linha';
  
  // Variável que vai aparecer na tela
  dataDoProximoJogo: string = '';

  // O ngOnInit roda automaticamente quando a tela é aberta
  ngOnInit() {
    this.calcularProximaQuinta();
  }

  calcularProximaQuinta() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // Retorna 0 para Dom, 1 para Seg... e 4 para Quinta
    
    let diasAteQuinta = 4 - diaDaSemana;
    
    // Se hoje for sexta ou sábado (já passou de quinta), soma 7 para ir para a próxima semana
    if (diasAteQuinta < 0) {
      diasAteQuinta += 7; 
    }
    
    const proximaQuinta = new Date(hoje);
    proximaQuinta.setDate(hoje.getDate() + diasAteQuinta);
    
    // Formata o número com zero na frente se for menor que 10 (Ex: de "5/9" para "05/09")
    const dia = proximaQuinta.getDate().toString().padStart(2, '0');
    const mes = (proximaQuinta.getMonth() + 1).toString().padStart(2, '0');
    
    this.dataDoProximoJogo = `${dia}/${mes}`;
  }

  confirmarVaga() {
    console.log('Posição escolhida:', this.posicaoSelecionada);
    alert('Vaga garantida com sucesso!');
  }
}