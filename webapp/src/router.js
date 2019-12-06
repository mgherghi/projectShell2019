import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ToDos from "./views/ToDos.vue";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",

      component: () =>
        import("./views/About.vue")
    },
    {
      path: "/todos",
      name: "todos",
      component: ToDos
    }
  ]
});
