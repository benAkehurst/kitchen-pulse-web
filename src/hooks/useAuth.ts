import { api } from "@/lib/api";

export const useAuth = () => {
  const register = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return { register, login, logout };
};
