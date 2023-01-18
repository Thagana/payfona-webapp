import * as React from "react";
import "./App.css";
import AppRouter from "./routes/routes";
import { createStore, StoreProvider as Provider, persist } from "easy-peasy";
import Store from "./store/model";

const store = createStore(
  persist(Store, {
    storage: "localStorage",
  })
);

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
