import Vue from 'vue';
import VueRouter from 'vue-router';
// #region import Notes
import AppNoteList from './components/AppNoteList.vue';
import AppNote from './components/AppNote.vue';
// #endregion import Notes

Vue.use(VueRouter);

const routes = [];

// #region Notes
routes.push({
  path: '/notes',
  component: AppNoteList,
});

routes.push({
  path: '/note/:noteId',
  props: true,
  component: AppNote,
});

routes.push({
  path: '/notes/new',
  props: true,
  component: AppNote,
});
// #endregion Notes

export default new VueRouter({
  // mode: 'history',
  routes,
});
