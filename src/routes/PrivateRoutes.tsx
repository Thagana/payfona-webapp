import * as React from "react";
import { Navigate } from "react-router-dom";
import { useStoreState } from "easy-peasy";
import { Model } from "../store/model";

interface PrivateRoutesProps {
  component: React.ComponentType;
}

export default function PrivateRoutes({
  component: Component,
}: PrivateRoutesProps): JSX.Element {
  const isLoggedIn = useStoreState<Model>((state) => state.isAuth);
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
}
