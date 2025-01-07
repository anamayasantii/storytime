import { createStore } from "vuex";
import auth from "./auth";
import story from "./story";

export const store = createStore({
    modules: {
        auth,
        story,
    }
})