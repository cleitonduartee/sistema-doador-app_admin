<template>
  <div>
    <v-toolbar  color="white">
      <v-toolbar-title>Utensilios</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on"
            >Novo utensilio</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <v-card-text class="headline font-weight-bold">{{
              formTitle
            }}</v-card-text>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="editedItem.nome"
                    label="Nome"
                  ></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm6>
                  <small>Estado do utensilio</small>
                  <v-radio-group v-model="editedItem.estado" row>
                    <v-radio
                      v-for="n in ['NOVO', 'USADO']"
                      :key="n"
                      :label="`${n}`"
                      :value="n"
                    ></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm6>
                  <small>Utensilio disponível?</small>
                  <v-radio-group v-model="editedItem.disponivel" row>
                    <v-radio
                      v-for="n in ['SIM', 'NÂO']"
                      :key="n"
                      :label="`${n}`"
                      :value="n == 'SIM' ? true : false"
                    ></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs12>
                  <small>Doador</small>
                  <v-select :disabled='editedIndex === -1 ? false : true' :items=doadores :item-text="'nome'" :item-value="'id'" v-model="editedItem.pessoa.id"></v-select>                                    
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="close">Cancelar</v-btn>            
            <v-btn
              color="green"
              v-if="editedItem.id == null"
              
              @click="salvar"
              >Salvar</v-btn
            >
            <v-btn color="green" v-else  @click="atualizar"
              >Ataulizar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

       <!-- Inicio confirmação de exclução -->

      <v-dialog v-model="dialogExclusao" persistent max-width="390">
        <v-card>
          <v-container>
            <v-card-title class="headline">
              Deseja excluir esse utensilio ?
            </v-card-title>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  @click="closeExcluir"
              >Cancelar</v-btn
            >
            <v-btn color="red"  @click="deleteItem()">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Fim confirmação de exclução -->

      <!-- Inicio INFO -->
      <v-dialog v-model="dialogInfo" persistent max-width="490">
        <v-card>
          <v-container>
            <v-card-title class="headline">
              {{ info }}
            </v-card-title>
          </v-container>
        </v-card>
      </v-dialog>
      <!-- FIM INFO -->

    </v-toolbar>
    <v-data-table :headers="headers" :items="utensilios" class="elevation-1">
      <template v-slot:item.disponivel="{ item }">
        {{ item.disponivel == true ? "Sim" : "Não" }}
      </template>
      <template v-slot:item.pessoa="{ item }">
        {{ item.pessoa.nome }}
      </template>
      <template v-slot:item.action="{ item }">
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="confirmaExclusao(item)">
            mdi-delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UtensilioHttp from "../http/UtensilioHttp";
import DoadorHttp from "../http/DoadorHttp";

export default {
  data: () => ({
    dialog: false,
    dialogExclusao: false,
    dialogInfo:false,
    idExclusao:null,
    info:'',
    utensilios: [],
    doadores: [],
    headers: [
      {
        text: "Nome",
        align: "left",       
        value: "nome"
      },
      { text: "Estado", value: "estado", sortable: false},
      { text: "Disponível", value: "disponivel", sortable: false },
      { text: "Doador", value: "pessoa", sortable: false },
      { text: "Action", value: "action", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: null,
      nome: "",
      estado: null,
      disponivel: null,
      pessoa: {
        id:null,
      }
    },
    defaultItem: {
      id: null,
      estado: "",
      disponivel: null,
      pessoa: {
        id:null, 

      }
    }
  }),

  computed: {
    formTitle() {
     
      return this.editedIndex === -1 ? "Novo utensilio" : "Editar utensilio";
    }
  },   

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      let resposta = await UtensilioHttp.buscarTodos();
      if (resposta.status == 200) {
        this.utensilios = resposta.data;
      }
      let resp = await DoadorHttp.buscarTodos();
      if (resp.status == 200) {
        
        this.doadores = resp.data;
      }
    },
    mostraInfo() {
      this.dialogInfo = true
      setTimeout(() => {
        this.dialogInfo = false
        this.info = ''
      }, 1500);
    },

    editItem(item) {      
      this.editedIndex = this.utensilios.indexOf(item);      
      this.editedItem = Object.assign({}, item);      
      this.dialog = true;
    },

    confirmaExclusao(item) {
      this.idExclusao = item.id;
      this.dialogExclusao = true;
    },
    async deleteItem() {      
      if (this.idExclusao != null) {
        let resp = await UtensilioHttp.deletar(this.idExclusao);
        if (resp.status == 204) {
          this.closeExcluir();
          this.info = "Utensilio excluido com Sucesso."
          this.mostraInfo();
          this.initialize();
        }
      }
    },
    closeExcluir() {
      this.dialogExclusao = false;
      (this.idExclusao = null),
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async salvar() {
      if (this.editedItem.id == null) {       
        let resp = await UtensilioHttp.inserir(this.editedItem);
        if(resp.status == 201){          
          this.close();
          this.initialize();
          this.info = "Utensilio cadastrado com Sucesso."
          this.mostraInfo();
        }
      }
    },
    async atualizar(){
     
      if (this.editedItem.id != null) {       
        let resp = await UtensilioHttp.atualizar(this.editedItem.id,this.editedItem);
        if(resp.status == 200){
          
          this.close();
          this.initialize();
          this.info = "Utensilio atualizado com Sucesso."
          this.mostraInfo();
        }
      }
    }

  }
};
</script>