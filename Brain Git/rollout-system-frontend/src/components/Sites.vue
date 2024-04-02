<template>
  <div class="cards">
    <div class="card">
      <div class="card-header" v-if="showProject">
        <h5>Estações</h5>
        <div class="search-box">
          <i class="material-icons">search</i>
          <input type="text" v-model="search" placeholder="Buscar..."/>
        </div>
      </div>
      <table id="siteTable" v-if="showProject">
        <tr>
          <!-- <th>ID</th> -->
          <th>Index</th>
          <th>Estação</th>
          <th>Escopo</th>
          <th>Cidade</th>
          <th>Progresso</th>
          <th></th>
        </tr>
        <tr class="site" v-for="(site, index) in filteredSites" :key="index">
          <!-- <td>{{site.id}}</td> -->
          <td>{{parseInt(index)+1}}</td>
          <td v-on:click="$router.push('/sites/atividade/q?estacaoId=' + site.id)">{{ site.Nome }}</td>
          <td v-on:click="$router.push('/sites/atividade/q?estacaoId=' + site.id)">{{ site.Escopo }}</td>
          <td v-on:click="$router.push('/sites/atividade/q?estacaoId=' + site.id)">{{ site.cidadeId }}</td>
          <td v-on:click="$router.push('/sites/atividade/q?estacaoId=' + site.id)">
            <div class="bar">
              <div class="bar-fill"></div>
            </div>
          </td>
          <td><i class="material-icons icon-button" style="font-size: 18px" v-on:click="showRenameSiteWindow = true, getStatus(), getCidade(), siteIdRename = site.id">edit</i></td>
          <td><i class="material-icons icon-button" style="font-size: 18px" v-on:click="deleteSite(site.id)">delete</i></td>
        </tr>
      </table>
      <div class="card nonLink" style="text-align: center; font-size: 4vh;" v-if="!showProject">
        <a>Não há Estações</a>
      </div>
      <!-- <div class="paginate">
        <a href="#">&laquo;</a>
        <a class="active" href="#">1</a>
        <a href="#">2</a>
        <a href="#">&raquo;</a>
      </div> -->
      <!-- <span class="paginateSpan"> -->
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
      <!-- </span> -->
    </div>
    <button class="fab theme-blue" v-on:click="showCreateSiteWindow = true,  getStatus(), getCidade()">
      <i class="material-icons">add</i>
    </button>
    <!-- Create site window: -->
    <div class="blur-div" v-if="showCreateSiteWindow">
      <div class="card creation-window">
        <h5>Novo site</h5>
        <input type="text" placeholder="Estação..." v-model="nomeEstacao" autofocus><br>
        <input type="text" placeholder="Escopo..." v-model="escopo"><br>
        <select class="selectBox" style="width: 192px;" v-model="selectBoxCidade">
          <option value="" disabled>Cidade</option>
          <option v-for="(cidade, index) in cidades" :key="index" @click="indexCidadeCreate = index+1">{{cidade.Nome}}</option>
        </select><br>
        <input type="text" class="disabled" placeholder="Projeto ID..." v-model="projetoId" disabled><br>
        <select class="selectBox" style="width: 192px;" v-model="selectCreate">
          <option value="" disabled>Status</option>
          <option v-for="(status, index) in statuses" :key="index" @click="indexStatusCreate = index+1">{{status.Descricao}}</option>
        </select><br>
        <button class="theme-blue" v-on:click="createSite()">Criar</button>
        <button class="theme-red" v-on:click="showCreateSiteWindow = false">Cancelar</button>
      </div>
    </div>
    <div class="blur-div" v-if="showRenameSiteWindow">
      <div class="card creation-window">
        <h5>Atualizar Site</h5>
        <input type="text" placeholder="Estação..." v-model="nomeEstacaoRename" autofocus><br>
        <input type="text" placeholder="Escopo..." v-model="escopoRename"><br>
        <select class="selectBox" style="width: 192px;" v-model="selectBoxCidadeRename">
          <option value="" disabled>Cidade</option>
          <option v-for="(cidade, index) in cidades" :key="index" @click="indexCidadeRename = index+1">{{cidade.Nome}}</option>
        </select><br>
        <input type="text" class="disabled" placeholder="Projeto ID..." v-model="projetoIdRename" disabled title="Este parâmetro não pode ser alterado"><br>
        <select class="selectBox" style="width: 192px;" v-model="selectRename">
          <option value="" disabled>Status</option>
          <option v-for="(status, index) in statuses" :key="index" @click="indexStatusRename = index+1">{{status.Descricao}}</option>
        </select><br>
        <button class="theme-blue" v-on:click="renameSite()">Atualizar</button>
        <button class="theme-red" v-on:click="showRenameSiteWindow = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
  let baseUrl = 'http://localhost:3000/';
  import axios from 'axios';
  export default {
    name: 'Sites',
    data: () => {
      return {
        search: '',
        showCreateSiteWindow: false,
        showRenameSiteWindow: false,
        nomeEstacao: '',
        escopo: '',
        cidade: 'a',
        projetoId: '',
        statusId: '',
        sites: '',
        nomeEstacaoRename: '',
        escopoRename: '',
        cidadeRename: '',
        projetoIdRename: '',
        statusIdRename: '',
        selectCreate: '',
        selectRename: '',
        statuses: '',
        cidades: '',
        selectBoxCidade: '',
        selectBoxCidadeRename: '',
        indexCidadeCreate: '',
        indexStatusCreate: '',
        indexCidadeRename: '',
        indexStatusRename: '',
        siteIdRename: '',
        pagePaginate: 1,
        qtdPagePaginate: 0,
        showPaginate: false,
        showProject: false,
        
        // sites: [
        //   { nomeEstacao: 'estação 1', escopo: 'escopo 1', cidade: 'lugar 1' },
        //   { nomeEstacao: 'estação 2', escopo: 'escopo 2', cidade: 'lugar 2' },
        //   { nomeEstacao: 'estação 3', escopo: 'escopo 3', cidade: 'lugar 3' },
        // ],
      }
    },
    computed: {
      filteredSites() {
        if (this.search == '') {
          return this.sites
        }
        else return this.sites.filter( (site) => {
           //return site.Nome.match(this.search) || site.Escopo.match(this.search) || site.cidadeId.match(this.search);
           return site.Nome.toUpperCase().match(this.search.toUpperCase()) ||
                  site.Escopo.toUpperCase().match(this.search.toUpperCase()) 
         });
      },
    },
    mounted(){
      // let projetoId = this.$route.query.id;
      // console.log(projetoId)
      this.projetoIdInsert();
      this.getEstacoes();
    },
    methods: {
      createSite() {
        let thisInside = this;
        if (this.nomeEstacao.replace(/\s/g, "") !== "" && this.escopo.replace(/\s/g, "") !== "") {
          axios.post(baseUrl + 'estacao/create', {Nome: this.nomeEstacao, Escopo: this.escopo, cidadeId: this.indexCidadeCreate, projetoId: this.projetoId, statusId: this.indexStatusCreate})
          .then(function(response){
            if(response.data.estacaoCriada){
              thisInside.emitMessage("Estação criada com sucesso!", 1);
            }else{
              thisInside.emitMessage("Erro na criação da estação.", 2);
            }
          })
          this.getEstacoes();
          this.showCreateSiteWindow = false;
        }
        else {
          this.emitMessage("Não foi possível criar uma nova estação. Preencha todos os campos.", 2)
          this.showCreateSiteWindow = false;
        }
      },
      deleteSite(siteId) {
        let thisInside = this;
        if(confirm("A estacao será excluida.\nContinuar?")){
          axios.delete(baseUrl + 'estacao/' + siteId + '/delete')
          .then(function(response){
            if(response.data.estacaoDeleted){
              thisInside.emitMessage("Estação excluída com sucesso!", 1);
              thisInside.getEstacoes();
            }else{
              thisInside.emitMessage("Erro na exclusão da estação.", 2);
            }
          })
        }else{
          thisInside.emitMessage("Não foi possível excluir a estação.", 2);
        }
      },
      renameSite(){
        let thisInside = this;
        let statusID = 1;
        if (this.nomeEstacaoRename.replace(/\s/g, "") !== "" && this.escopoRename.replace(/\s/g, "") !== "" && this.projetoIdRename.replace(/\s/g, "") !== "") {
          axios.put(baseUrl + 'estacao/' + this.siteIdRename + '/update', {Nome: this.nomeEstacaoRename, Escopo: this.escopoRename, cidadeId: this.indexCidadeRename, projetoId: this.projetoIdRename, statusId: this.indexStatusRename})
          .then(function(response){
            if(response.data.updatedEstacao){
              thisInside.getEstacoes()
              thisInside.emitMessage("Estação atualizada com sucesso!", 1);
            }else{
              thisInside.getEstacoes()
              thisInside.emitMessage("Erro na atualização da estação.", 2);
            }
          })
          this.showRenameSiteWindow = false;
        }else{
          thisInside.emitMessage("Não foi possível atualizar esta estação. Preencha todos os campos.", 2);
          // alert("Preencha todos os campos")
        }
        // console.log(siteId)
      },
      getEstacoes(){
        let thisInside = this;
        // console.log(estacaoId);
        axios.get(baseUrl + 'estacoes/' + this.pagePaginate + '/' + this.projetoId)
        .then(function(response){
          if(response.data.totalPage == 0){
            thisInside.sites = '';
            thisInside.showProject = false;
          }else{
            thisInside.showProject = true;
            if(response.data.totalPage > 1){
              thisInside.showPaginate = true;
              thisInside.qtdPagePaginate = response.data.totalPage;
            }
            var estacaoQtdCurrentPage = response.data.estacaoQtdCurrentPage;
            delete response.data.totalPage;
            delete response.data.estacaoQtdCurrentPage;
            thisInside.sites = response.data;
            for(var i = 0; i < estacaoQtdCurrentPage; i++){
              // console.log(response.data[i].cidadeId)
              thisInside.getEstacaoCidade(response.data[i].cidadeId, i);
            }
          }
        })
      },
      getStatus(){
        let thisInside = this;
        let count = 0;
        axios.get(baseUrl + 'statuses/1')
        .then(function(response){
          thisInside.statuses = response.data;
        })
      },
      getCidade(){
        let thisInside = this;
        axios.get(baseUrl + 'cidades/1')
        .then(function(response){
          if(response.data.length == 0){
            thisInside.cidades = '';
          }else{
            thisInside.cidades = response.data;
          }
        })
      },
      getEstacaoCidade(cidadeId, indexCidade){
        let thisInside = this;
        axios.get(baseUrl + 'cidade/'+cidadeId)
        .then(function(response){
          if(response.data != null){
            thisInside.sites[indexCidade].cidadeId = response.data.Nome
          }
        })
      },
      projetoIdInsert(){
        this.projetoId = this.$route.query.projetoId;
        this.projetoIdRename = this.$route.query.projetoId;
      },
      paginateFunction(){
        this.getEstacoes();
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
  .card .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card .card-header, .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .site {
    cursor: pointer;
  }
  .site:hover {
    background-color: #F1F1F1;
  }
  .bar {
    width: 7vw;
    min-width: 14px;
    height: 4px;

    background-color: rgba(33, 150, 243, 0.4);
    border-radius: 2px;
  }
  .bar-fill {
    width: 2.5vw;
    height: 4px;

    background-color: rgba(33, 150, 243, 1.0);
    border-radius: 2px;
  }
  .fab {
    position: fixed;
    bottom: 15px;
    right: 4%;
  }
  .containerPaginate{
    text-align: center;
    position: relative;
    padding: 3vh 0 1vh 0;
  }
  .paginate{
    display: inline-flex;
    /* border: 3px solid #73AD21; */
  }
  .nonLink a{
    cursor: default;
  }
  input{
    margin: 8px;
  }
</style>
