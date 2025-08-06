"use client"

import { useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function useAxiosInstance(extraHeaders = {}) {
  const { logout, user } = useAuth();
  const router = useRouter()

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5012/api",
        // import.meta.env.VITE_APP_AXIOS_INSTANCE_ROUTE,
        headers: {
          Authorization: "Bearer " + user?.token,
          ...extraHeaders, // Merge extra headers dynamically
        },
      }),
    [user]
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if (user?.token && err?.response?.status === 401) {
        logout();
        router.push("/auth/login");
      } else if (err?.response?.status === 403) {
        router.push("/main/dashboard");
      }
      return Promise.reject(err);
    }
  );

  return axiosInstance;
}
