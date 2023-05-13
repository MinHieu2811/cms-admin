import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "@/src/services/auth/AuthContext";
import { useEffect } from "react";

export const useDirectUnauthenticated = () => {
  const { isAuthenticated } = useAuthContext()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(pathname + search)}`, {
        replace: true
      })
    }
  }, [isAuthenticated, navigate, pathname, search])
}