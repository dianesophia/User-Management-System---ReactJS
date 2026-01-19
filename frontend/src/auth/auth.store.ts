export const authStore = {
  setSession(data: any) {
    localStorage.setItem("accessToken", data.token.accessToken);
    localStorage.setItem("refreshToken", data.token.refreshToken);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userId", data.user.id);
  },

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  },

  get role() {
    return localStorage.getItem("role");
  },

  get accessToken() {
    return localStorage.getItem("accessToken");
  },

  get refreshToken() {
    return localStorage.getItem("refreshToken");
  },

  get userId() {
    return localStorage.getItem("userId");
  },
};
