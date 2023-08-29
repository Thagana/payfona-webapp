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
import Invoice from "../components/Invoice";
import InvoiceDetail from "../views/Invoices/Invoice";
import PayView from "../views/PayView";
import Invoices from "../views/Invoices";
import NotFound from "../views/NotFound";
import CreateInvoice from "../views/Invoices/Create";
import InvoicePDFViewer from "../views/InvoicePDFViewer";
import Accounts from "../views/Accounts";
import CreateAccount from "../views/Accounts/CreateAccount";
import ForgotPassword from "../views/Auth/ForgotPassword/ForgotPassword";
import ChangePassword from "../views/Auth/Changepassword/ChangePassword";
import Customer from "../views/Customers/Customers";
import InvoiceRefund from "../views/Refund/InvoiceRefund";

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
          path="/invoice/:invoiceId"
          element={<PrivateRoutes component={InvoiceDetail} />}
        />
        <Route path="/invoice/create" element={<PrivateRoutes component={CreateInvoice} />} />
        <Route path="/invoice/pay-now" element={<PayView />} />
        <Route path="/view_invoice" element={<Invoice />} />
        <Route path="/invoice-url" element={<PrivateRoutes component={InvoicePDFViewer} />} />
        <Route path="/invoice-refunds" element={<PrivateRoutes component={InvoiceRefund} />} />
        <Route path='/customers' element={<PrivateRoutes component={Customer} />} />
        
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password-request" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/profile"
          element={<PrivateRoutes component={Profile} />}
        />
        <Route
          path="/profile/edit"
          element={<PrivateRoutes component={Edit} />}
        />
        <Route path="/accounts" element={<PrivateRoutes component={Accounts} />} />
        <Route path="/accounts/create" element={<PrivateRoutes component={CreateAccount} />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
