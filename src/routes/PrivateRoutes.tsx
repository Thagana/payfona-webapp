import * as React from "react";
import { Navigate } from "react-router-dom";
import { useStoreState } from "easy-peasy";

export default function PrivateRoutes({
  component: Component,
}: any): JSX.Element {
  const isLoggedIn = useStoreState<any>((state) => state.isAuth);
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
}
