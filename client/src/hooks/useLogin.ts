import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export type LoginInput = {
  username: string;
  password: string;
  role?: "brand" | "manufacturer" | "admin" | "creator" | "designer";
};

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiRequest("POST", "/api/login", data);
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.message || "Login failed");
      }
      return json;
    },
    onSuccess: async () => {
      // Refresh the authenticated user state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });
}