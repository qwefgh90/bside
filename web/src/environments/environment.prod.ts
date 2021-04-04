export const environment = {
  production: true,
  // redirect_url: "http://xxx/redirect",
  // apiServer: "http://localhost:8080"
  // get redirect_url(){
  //   return `${location.origin}/redirect`;
  // },
  // apiServer: "/api",
  get authorizeOriginUrl(){
    return "https://github.com/login/oauth/authorize";//?client_id=c602a8bd54b1e774f864&scope=repo
  },
  targetId: "UA-145533506-2",
  firebase: {
    apiKey: "AIzaSyBkX1a6Ypg7nI39vwx7eeakdOplFWIxog4",
    authDomain: "bside-fef0d.firebaseapp.com",
    projectId: "bside-fef0d",
    storageBucket: "bside-fef0d.appspot.com",
    messagingSenderId: "945645208760",
    appId: "1:945645208760:web:82b4d8212443955d74204d",
    measurementId: "G-39739Y9ZBH"
    // databaseURL: '<your-database-URL>',
  }
};
