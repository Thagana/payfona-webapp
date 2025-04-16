import * as React from "react";
import { Navigate } from "react-router-dom";
import { useStoreState } from "easy-peasy";
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '')


export default function PrivateRoutes({
  component: Component,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoggedIn = useStoreState<any>((state) => state.isAuth);
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
}
