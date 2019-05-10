export const environment = {
  production: true,
  // redirect_url: "http://xxx/redirect",
  // apiServer: "http://localhost:8080"
  
  get redirect_url(){
    return `${location.origin}/redirect`;
  },
  apiServer: "/api",
  get authorizeOriginUrl(){
    return "https://github.com/login/oauth/authorize";//?client_id=c602a8bd54b1e774f864&scope=repo
  }
};
