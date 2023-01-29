import * as React from "react";
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
