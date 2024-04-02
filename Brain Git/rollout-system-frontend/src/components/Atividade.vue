<template>
  <div class="cards">
    <div style="display: flex; flex-direction: column;">
      <!-- <div class="card">
        <h5>Nome da Demanda</h5>
        <label class="input-label">Estação</label><input type="text" v-model="estacaoResumo"/>
        <label class="input-label">Escopo</label><input type="text" v-model="escopoResumo"/>
        <label class="input-label">Localidade</label><input type="text" v-model="localidadeResumo"/>
      </div> -->
      <!-- <div class="card">
        <div class="pie-chart" :style="chartStyle"></div>
      </div> -->
    </div>
    <div>
      <div class="card">
        <div class="card-header" v-if="showProject">
          <h5>Demandas</h5>
          <div v-if="renameSubmit"><i class="material-icons icon-button" style="font-size: 18px" v-on:click="updateAtividade()">done_outline</i></div>
          <div v-if="!renameSubmit" class="search-box">
            <i class="material-icons">search</i>
            <input type="text" v-model="search" placeholder="Buscar..."/>
          </div>
        </div>
        <table v-if="showProject">
          <tr>
            <th>Index</th>
            <th>Nome</th>
            <th>Escopo</th>
            <th>Tipo</th>
            <th>Status</th>
            <th></th>
          </tr>
          <tr class="site" v-for="(demanda, index) in demandas" :key="index">
            <td>{{parseInt(index)+1}}</td>
            <td><input class="editable" style="width: 140px;" type="text" v-model="demanda.Nome" v-on:keyup.enter="updateAtividade()" @click="updateArray = demanda, enableEdit(demanda.id)"></td>
            <td><input class="editable" style="width: 140px;" type="text" v-model="demanda.Escopo" v-on:keyup.enter="updateAtividade()" @click="updateArray = demanda, enableEdit(demanda.id)"></td>
            <td><input class="editable" style="width: 140px;" type="text" v-model="demanda.Tipo" v-on:keyup.enter="updateAtividade()" @click="updateArray = demanda, enableEdit(demanda.id)"></td>
            <!-- <td v-if="true"><input class="editable" type="text" v-model="demanda.estacaoId"></td> -->
            <td><div class="theme-red status" @click="updateStatus(index, demanda.statusId)"> {{ transformStatusId(index, demanda.statusId) }} </div></td>
            <td><i class="material-icons icon-button" style="font-size: 18px" v-on:click="deleteTask(demanda.id)">delete</i></td>
          </tr>
        </table>
        <div class="containerPaginate" v-if="showPaginate">
          <paginate
            v-model="pagePaginate"
            :page-count="qtdPagePaginate"
            :page-range="3"
            :margin-pages="2"
            :click-handler="paginateFunction"
            :container-class="'paginate'"
            :first-last-button="true"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :first-button-text="'First'"
            :last-button-text="'Last'"
            :no-li-surround="true"
            :page-link-class="'otherPaginateItem'"
            :prev-link-class="'otherPaginateItem'"
            :next-link-class="'otherPaginateItem'"
            :disabled-class="'disabledPaginateItem'"
            :active-class="'activePaginateItem'"
          >
          </paginate>
        </div>
      <div class="card nonLink" style="text-align: center; font-size: 4vh;" v-if="!showProject">
        <a>Não há Demandas</a>
      </div>
      </div>
    </div>
    <button class="fab theme-blue" @click="showCreateTaskWindow = true, getStatus()">
      <i class="material-icons">add</i>
    </button>
    <!-- Create task window: -->
    <div class="blur-div" v-if="showCreateTaskWindow">
      <div class="card creation-window">
        <h5>Nova demanda</h5>
        <input class="text" type="text" placeholder="Nome..." v-model="nome" autofocus><br>
        <input class="text" type="text" placeholder="Escopo..." v-model="escopo"><br>
        <input class="text" type="text" placeholder="Tipo..." v-model="tipo"><br>
        <select class="selectBox" style="width: 192px;" v-model="selectCreate">
          <option value="" disabled>Status</option>
          <option v-for="(status, index) in statuses" :key="index" @click="indexStatusCreate = index+1">{{status.Descricao}}</option>
        </select><br>
        <!-- <input type="text" placeholder="Status..." v-model="statusId"><br> -->
        <button class="theme-blue" v-on:click="createTask()">Criar</button>
        <button class="theme-red" v-on:click="showCreateTaskWindow = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  let baseUrl = 'http://localhost:3000/';
  export default {
    name: 'Atividade',
    data: () => {
      return {
        estacaoResumo: 'Estação X',
        escopoResumo: 'Escopo X',
        localidadeResumo: 'Localidade X',
        search: '',
        showCreateTaskWindow: false,
        demandas: '',
        nome: '',
        escopo: '',
        tipo: '',
        statusId: '',
        renameSubmit: '',
        demandaIdUpdate: '',
        demandaIdUpdateOld: '',
        demandaIdUpdateNovo: '',
        updateArray: [],
        pagePaginate: 1,
        qtdPagePaginate: 1,
        showPaginate: false,
        showProject: false,
        status: '',
        selectCreate: '',
        statuses: '',
        indexStatusCreate: '',
      
        chartStyle: {
          background: `conic-gradient(
            rgb(76, 175, 80) 0 33%, 
            rgb(244, 67, 54) 0 66%, 
            rgb(33, 150, 243) 0 100%`
        }
      }
    },
    mounted(){
      this.getAtividade();
    },
    computed: {
      filteredTasks() {
        return this.demandas.filter( (demanda) => {
          return demanda.descricao.match(this.search) || demanda.comentario.match(this.search);
        });
      }
    },
    methods: {
      createTask() {
        let thisInside = this;
        if (this.nome.replace(/\s/g, "") !== "" && this.escopo.replace(/\s/g, "") !== "" && this.tipo.replace(/\s/g, "") !== "") {
          let estacaoId = this.$route.query.estacaoId;
          axios.post(baseUrl + 'atividade/create', {Nome: this.nome, Escopo: this.escopo, Tipo: this.tipo, estacaoId: estacaoId, statusId: this.indexStatusCreate})
          .then(function(response){
            if(response.data.atividadeCriada){
              thisInside.emitMessage("Demanda criada com sucesso!", 1);
            }else{
              thisInside.emitMessage("Erro na criação da demanda.", 2);
            }
            thisInside.getAtividade()
          })
          this.showCreateTaskWindow = false
        }
        else {
          this.emitMessage("Não foi possível atualizar esse projeto. Preencha todos os campos.", 2);
        }
      },
      deleteTask(demandaId) {
        let thisInside = this;
        if (confirm("Deseja excluir essa demanda?")) {
          axios.delete(baseUrl + 'atividade/' + demandaId + '/delete')
          .then(function(response){
            if(response.data.atividadeDeletada){
              thisInside.emitMessage("Demanda excluída com sucesso!", 1);
            }else{
              thisInside.emitMessage("Erro na exclusão da demanda.", 2);
            }
            thisInside.getAtividade();
          })
        }else{
          this.emitMessage("Demanda não excluída.", 2);
        }
      },
      updateStatus(index, demandaStatusId) {
        let status = document.getElementsByClassName("status")
        if(demandaStatusId == 1){
          status[index].classList.replace("theme-red", "theme-green")
          status[index].innerHTML = "Aprovado"
        }else if(demandaStatusId == 2){
          status[index].classList.replace("theme-red", "theme-red")
          status[index].innerHTML = "Reprovado"
        }else if(demandaStatusId == 3){
          status[index].classList.replace("theme-red", "theme-blue")
          status[index].innerHTML = "Em análise"
        }
      },
      getAtividade(){
        let thisInside = this;
        let estacaoId = this.$route.query.estacaoId;
        axios.get(baseUrl + 'atividades/' + this.pagePaginate + '/' + estacaoId)
        .then(function(response){
          if(response.data.totalPage == 0){
            thisInside.showProject = false;
          }else{
            thisInside.showProject = true
            if(response.data.totalPage > 1){
              thisInside.showPaginate = true
              thisInside.qtdPagePaginate = response.data.totalPage;
            }
            delete response.data.totalPage;
            thisInside.demandas = response.data;
            // console.log(response)
          }
        })
      },
      checkStatus(){
        var status = document.getElementById("status");
        // console.log(status)
      },
      enableEdit(demandaId){
        this.demandaIdUpdateNovo = demandaId;
        if(this.demandaIdUpdateOld == ''){
          this.demandaIdUpdateOld = demandaId;
          this.demandaIdUpdate = demandaId;
        }else if(this.demandaIdUpdateNovo != this.demandaIdUpdateOld){
          alert("Erro!\nSalve as alterações antes de continuar")
        }
        this.renameSubmit = true;
        // this.demandaIdUpdate = demandaId;
        // this.demandaIdUpdateOld = demandaId;
      },
      updateAtividade(){
        let thisInside = this;
        let demandaId = this.demandaIdUpdate;
        let dadosUpdate = this.updateArray;
        // console.log(this.updateArray)
        axios.put(baseUrl + 'atividade/' + this.demandaIdUpdate + '/update', {Nome: dadosUpdate.Nome, Escopo: dadosUpdate.Escopo, Tipo: dadosUpdate.Tipo, estacaoId: dadosUpdate.estacaoId, statusId: dadosUpdate.statusId})
        .then(function(response){
          if(response.data.atividateUpdate){
            thisInside.demandaIdUpdate = '';
            thisInside.demandaIdUpdateOld = '';
            thisInside.demandaIdUpdateNovo = '';
            thisInside.getAtividade();
          }else{
            console.log("Erro na atualizacao da atividade");
          }
        })
        this.renameSubmit = false;
        // this.demandaIdUpdate = '';
      },
      getStatus(){
        let thisInside = this;
        let count = 0;
        axios.get(baseUrl + 'statuses/1')
        .then(function(response){
          thisInside.statuses = response.data;
        })
      },
      paginateFunction(){
        this.getAtividade();
      },
      transformStatusId(index, statusId){
        // status[index].classList.replace("theme-red", "theme-green")

        if(statusId == 1){
          return "Aprovado";
        }else if(statusId == 2){
          var classReplace = document.getElementsByClassName("status");         
          return "Reprovado";
        }else if(statusId == 3){
          return "Em análise";
        }else{
          return;
        }
      },
      emitMessage(message, type){
        //Tipos de mensagem:
        // 0 => primary
        // 1 => success
        // 2 => danger
        // 3 => warning
        if(!type){
          type = 0;
        }
        this.$emit('Message', message, type);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cards .card {
    flex: 0 0 auto;
  }
  .input-label {
    margin: 16px 0px -10px 0px;
    padding: 0px 8px;
    display: block;
    color: #888;
    font-size: 12px;
    font-weight: 600;
  }
  .pie-chart {
    margin: 8px;
    width: 194px;
    height: 194px;
    border-radius: 50%;
  }
  .card .card-header, .search-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .editable {
    border-bottom: none;
    cursor: text;
    text-align: center;
    padding: 0vw;
  }
  .editable:hover {
    border-bottom: 1px solid currentColor;
  }
  .editable:focus {
    border-bottom: 2px solid rgb(33, 150, 243);
  }
  .status {
    width: 124px;
    padding: 4px 8px;
    border-radius: 2px;
    cursor: pointer;
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .fab {
    position: fixed;
    bottom: 15px;
    right: 4%;
  }
  .nonLink a{
    cursor: default;
  }
  td{
    padding: 0.3vw;
  }
  .text{
    margin: 8px;
  }
</style>