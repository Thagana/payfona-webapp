import * as React from "react";
import { BrowserRouter } from 'react-router-dom';
import { createStore, StoreProvider as Provider, persist } from "easy-peasy";
import "@total-typescript/ts-reset";

import AppRouter from "./routes/routes";

import Store from "./store/model";

import "./App.css";

const store = createStore(
  persist(Store, {
    storage: "localStorage",
  })
);

function App() {
  return (
    <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
    </Provider>
  );
}

export default App;
