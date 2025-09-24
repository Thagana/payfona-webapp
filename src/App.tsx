import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { createStore, StoreProvider as Provider, persist } from "easy-peasy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@total-typescript/ts-reset";

const queryClient = new QueryClient();

import AppRouter from "./routes/routes";

import Store from "./store/model";

import "./App.scss";

const store = createStore(
  persist(Store, {
    storage: "localStorage",
  }),
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
