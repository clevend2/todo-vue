import VueRouter, { Route } from 'vue-router';
// #region import Notes
import AppNoteList from './components/AppNoteList.vue';
import AppNote from './components/AppNote.vue';
// #endregion import Notes

const routes = [];

// #region Notes

routes.push({
  path: '/notes',
  component: AppNoteList,
  children: [
    {
      path: 'note/:noteId',
      props: true,
      component: AppNote,
    },
  ],
});

// #endregion Notes
// #region Tasks

routes.push({
  path: '/tasks',
  component: AppNoteList,
  props: true,
  children: [
    {
      path: 'task/:taskId',
      props: true,
      component: AppNote,
    },
  ],
});

// #endregion Tasks

export default new VueRouter({
  mode: 'history',
  routes,
});
