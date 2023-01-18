import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActivateAccount from "../views/Auth/ActivateAccount";

import PrivateRoutes from "./PrivateRoutes";
import SignIn from "../views/Auth/SignIn";
import SignUp from "../views/Auth/SignUp";
import Home from "../views/Home";
import Profile from "../views/Profile";
import Edit from "../views/Profile/Edit";
import Invoice from "../views/Invoice";
import PayView from "../views/PayView";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoutes component={Home} />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/profile" element={<PrivateRoutes component={Profile} />} />
        <Route path="/profile/edit" element={<PrivateRoutes component={Edit} />} />
        <Route path="/view_invoice" element={<Invoice />} />
        <Route path="/invoice/pay-now" element={<PayView />} />
      </Routes>
    </Router>
  );
}
