<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Utensilios</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Novo utensilio</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <v-card-text class="headline font-weight-bold">{{ formTitle }}</v-card-text>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm5 >
                  <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm3 >
                  <v-text-field v-model="editedItem.estado" label="Estado"></v-text-field>
                </v-flex>  
                <v-spacer></v-spacer>
                <v-flex xs12 sm3 >
                   <v-select
          :items="disponivel"
          label="Disponível"
        ></v-select>
                  
                </v-flex>                                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="green" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    >
    <template v-slot:item.disponivel="{ item }">      
        {{ item.disponivel==true ? "Sim":"Não" }}
      </template>
      <template v-slot:item.action="{ item }">      
             
        <td class="justify-center layout px-0">          
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
           mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
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
  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Nome',
          align: 'left',
          sortable: false,
          value: 'nome'
        },
        { text: 'Estado', value: 'estado' },
        { text: 'Disponível', value: 'disponivel' },
        { text: 'Doador', value: 'doador' },
        { text: 'Action', value: 'action', sortable: false, }
        
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nome: '',
        estado: '', 
        disponivel:'' ,
        doador: ''        
      },
      defaultItem: {
        nome: '',
        estado: '',        
        disponivel:'' ,
        doador: ''  
      },
      disponivel:[true,false]
       
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo utensilio' : 'Editar utensilio'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            nome: 'Cadeira de Plastico',
            estado: 'USADO',        
            disponivel: true,
            doador: 'Cleiton Duarte'           
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          this.editItem.disponivel = this.disponivel
          console.log(this.editItem)
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>