import { createRouter, createWebHistory } from "vue-router";
import EditorView from "./views/EditorView.vue";
import FullView from "./views/FullView.vue";

const routes = [
  { path: "/", component: EditorView },
  { path: "/full", component: FullView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
