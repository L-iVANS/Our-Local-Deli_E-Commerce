import { useMutation } from "@tanstack/react-query";
import ky, { Options } from "ky";
import { LoginMutationData, LoginMutationVariables } from "../components/login/types";

const api = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  credentials: "include", // Include cookies in requests
} as Options);

export const useLoginMutation = () => {
  return useMutation<LoginMutationData, Error, LoginMutationVariables>({
    mutationFn: async (variables) => {
      const response = await api.post("auth/login", {
        json: variables,
      }).json<{ message: string; access_token?: string }>();
      
      return {
        login: {
          message: response.message
        }
      };
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<{ logout: { message: string } }, Error, void>({
    mutationFn: async () => {
      const response = await api.post("auth/logout").json<{ message: string }>();
      return {
        logout: {
          message: response.message
        }
      };
    },
  });
};
