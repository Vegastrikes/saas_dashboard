import { defineStore } from "pinia";
import { api } from "../services/api";
import type { AuthResponse, User } from "../types/auth";

const TOKEN_KEY = "access_token";

type AuthState = {
  token: string | null;
  user: User | null;
  isReady: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    isReady: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },

  actions: {
    setSession(token: string, user: User) {
      this.token = token;
      this.user = user;
      localStorage.setItem(TOKEN_KEY, token);
    },

    clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },

    async register(email: string, password: string) {
      const res = await api.post<AuthResponse>("/auth/register", { email, password });
      this.setSession(res.token, res.user);
    },

    async login(email: string, password: string) {
      const res = await api.post<AuthResponse>("/auth/login", { email, password });
      this.setSession(res.token, res.user);
    },

    async logout() {
      this.clearSession();
    },

    async hydrate() {
      // Ensures router guards can wait for the auth state to be known
      try {
        if (!this.token) return;
        const res = await api.get<{ user: User }>("/auth/me");
        this.user = res.user;
      } catch {
        this.clearSession();
      } finally {
        this.isReady = true;
      }
    },
  },
});
