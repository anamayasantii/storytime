import { createApp } from 'vue';                
import router from './router';

import Index from './pages/index.vue';
import { store } from './store/index';

createApp(Index).use(router).use(store).mount('#app')