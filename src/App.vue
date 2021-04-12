<template>
  <!-- Tag raiz do projeto -->
  <v-app id="inspire">
    <!-- Barra de navegação -->
    <v-navigation-drawer v-model="drawer" app>
      <!-- Lista de rotas -->
      <v-list dense>
        <v-list-item
          v-for="(rota, index) in rotas"
          :key="index"
          :to="rota.rota"
          link
        >
          <v-list-item-action>
            <v-icon>{{ rota.icone }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ rota.titulo }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Barra superior -->
    <v-app-bar app color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ titulo }}</v-toolbar-title>
    </v-app-bar>

    <!-- Área principal de conteúdo -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Rodapé -->
    <v-footer color="blue-grey" app>
      <span class="white--text"
        >&copy; {{ rodape }} {{ new Date().getFullYear() }}</span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data:()=>({
    drawer: null,
    titulo: "Doação Admin",
    rodape: "Cleiton Duarte Goncaçalves",
    rotas: [      
      {
        icone: "mdi-account",
        titulo: "Doador",
        rota: "/doador",
      },
      {
        icone: "mdi-domain",
        titulo: "Utensilios",
        rota: "/utensilios",
      }
    ],
  }),
};
</script>