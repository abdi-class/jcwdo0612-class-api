import App from "./app";

const main = () => {
  const server = new App(); // instance of App express

  server.start();
};

main();
