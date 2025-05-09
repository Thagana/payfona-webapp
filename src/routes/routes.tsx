import * as React from "react";
import { Routes, Route, useLocation, Router } from "react-router-dom";
import ActivateAccount from "../views/Auth/ActivateAccount";
import { AnimatePresence } from "framer-motion";

import PrivateRoutes from "./PrivateRoutes";
import SignIn from "../views/Auth/SignIn";
import SignUp from "../views/Auth/SignUp";
import Home from "../views/Home";
import Profile from "../views/Profile";
import Edit from "../views/Profile/Edit";
import InvoiceDetail from "../views/Invoices/Invoice";
import PayView from "../views/PayView";
import Invoices from "../views/Invoices";
import NotFound from "../views/NotFound";
import CreateInvoice from "../views/Invoices/Create";
import Accounts from "../views/Accounts";
import CreateAccount from "../views/Accounts/CreateAccount";
import ForgotPassword from "../views/Auth/ForgotPassword/ForgotPassword";
import ChangePassword from "../views/Auth/Changepassword/ChangePassword";
import Customer from "../views/Customers/Customers";
import InvoiceRefund from "../views/Refund/InvoiceRefund";
import ViewInvoice from "../views/ViewInvoice";
import Layout from "../views/Layout";
import AddCustomer from "../views/Customers/CreateCustomer";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/invoices"
            element={<PrivateRoutes component={Invoices} />}
          />
          <Route
            path="/invoice/:invoiceId"
            element={<PrivateRoutes component={InvoiceDetail} />}
          />
          <Route path="/view_invoice/:invoiceId" element={<ViewInvoice />} />
          <Route
            path="/invoice/create"
            element={<PrivateRoutes component={CreateInvoice} />}
          />
          <Route path="/invoice/pay-now" element={<PayView />} />
          <Route
            path="/invoice-refunds"
            element={<PrivateRoutes component={InvoiceRefund} />}
          />
          <Route
            path="/customers"
            element={<PrivateRoutes component={Customer} />}
          />
          <Route
            path="/customers/create"
            element={<PrivateRoutes component={AddCustomer} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoutes component={Profile} />}
          />
          <Route
            path="/profile/edit"
            element={<PrivateRoutes component={Edit} />}
          />
          <Route
            path="/accounts"
            element={<PrivateRoutes component={Accounts} />}
          />
          <Route
            path="/accounts/create"
            element={<PrivateRoutes component={CreateAccount} />}
          />
        </Route>
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password-request" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
