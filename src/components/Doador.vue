<template>
  <div>
    <v-toolbar  color="white">
      <v-toolbar-title>Doadores</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Novo doador</v-btn>
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
                <v-flex xs12 sm7>
                  <v-text-field
                    v-model="editedItem.nome"
                    label="Nome"
                  ></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="editedItem.telefone"
                    label="Telefone"
                  ></v-text-field>
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
              Deseja excluir esse doador ?
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
    <v-data-table :headers="headers" :items="doadores" class="elevation-1">
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
import DoadorHttp from "../http/DoadorHttp";

export default {
  data: () => ({
    dialogInfo: false,
    info: "",
    dialog: false,
    dialogExclusao: false,
    headers: [
      {
        text: "Nome",
        align: "left",        
        value: "nome"
      },
      { text: "Telefone", value: "telefone",sortable: false },
      { text: "Action", value: "action", sortable: false }
    ],
    doadores: [],
    idExclusao: null,
    editedIndex: -1,
    editedItem: {
      id: null,
      nome: "",
      telefone: ""
    },
    defaultItem: {
      id: null,
      nome: "",
      telefone: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo doador" : "Editar doador";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      let resposta = await DoadorHttp.buscarTodos();
      if (resposta.status == 200) {
        this.doadores = resposta.data;
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
      this.editedIndex = this.doadores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    confirmaExclusao(item) {
      this.idExclusao = item.id;
      this.dialogExclusao = true;
    },
    async deleteItem() {      
      if (this.idExclusao != null) {
        let resp = await DoadorHttp.deletar(this.idExclusao);
        if (resp.status == 204) {
          this.closeExcluir();
          this.info = "Doador excluido com Sucesso."
          this.mostraInfo();
          this.initialize();
        }
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    closeExcluir() {
      this.dialogExclusao = false;
      (this.idExclusao = null),
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
    },

    async salvar() {
      if(this.editedItem.id == null){
        let resp = await DoadorHttp.inserir(this.editedItem)
        if(resp.status == 201){
          this.info = "Doador criado com Sucesso."
          this.close();
          this.mostraInfo();
          this.initialize();
        }
      }
    },
    async atualizar() {
      if (this.editedItem.id != null) {
        let resp = await DoadorHttp.atualizar(
          this.editedItem.id,
          this.editedItem
        );
        if (resp.status == 200) {
          this.close();
          this.initialize();
          this.info = "Doador atualizado com Sucesso."
          this.mostraInfo();
        }
      }
    }
  }
};
</script>