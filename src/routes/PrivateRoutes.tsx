import * as React from "react";
import { Navigate } from "react-router-dom";
import { useStoreState } from "easy-peasy";

export default function PrivateRoutes({
  component: Component,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoggedIn = useStoreState<any>((state) => state.isAuth);
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
}
