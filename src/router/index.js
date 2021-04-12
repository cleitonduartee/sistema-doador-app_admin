import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [  
  {
    path: "/doador",
    name: "doador",
    component: ()=>
      import("../components/Doador.vue")
  },
  {
    path: "/utensilios",
    name: "utensilios",
    component: ()=>
      import("../components/Utensilio.vue")
  }
];

const router = new VueRouter({
  routes,
});

export default router;