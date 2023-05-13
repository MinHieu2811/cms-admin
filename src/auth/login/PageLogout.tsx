import React, { useEffect } from "react";

import {useQueryClient} from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/src/services/auth/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

export const PageLogout = () => {
  const {updateToken} = useAuthContext()
  const navigate = useNavigate()
  const queryCache = useQueryClient()

  useEffect(() => {
    updateToken(null)
    queryCache?.clear()
    navigate('/')
  }, [updateToken, queryCache, navigate])

  return (
    <Center flex="1">
      <Spinner />
    </Center>
  )
}