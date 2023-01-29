import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ActivateAccount from "../views/Auth/ActivateAccount";
import { AnimatePresence } from "framer-motion";

import PrivateRoutes from "./PrivateRoutes";
import SignIn from "../views/Auth/SignIn";
import SignUp from "../views/Auth/SignUp";
import Home from "../views/Home";
import Profile from "../views/Profile";
import Edit from "../views/Profile/Edit";
import Invoice from "../views/Invoice";
import InvoiceDetail from "../views/Invoices/Invoice";
import PayView from "../views/PayView";
import Invoices from "../views/Invoices";
import NotFound from "../views/NotFound";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<PrivateRoutes component={Home} />} />
        <Route
          path="/invoices"
          element={<PrivateRoutes component={Invoices} />}
        />
        <Route
          path="/invoices/:invoiceId"
          element={<PrivateRoutes component={InvoiceDetail} />}
        />
        <Route path="/invoice/pay-now" element={<PayView />} />
        <Route path="/view_invoice" element={<Invoice />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/profile"
          element={<PrivateRoutes component={Profile} />}
        />
        <Route
          path="/profile/edit"
          element={<PrivateRoutes component={Edit} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
