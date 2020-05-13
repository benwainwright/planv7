import renderApp from "./renderApp";

renderApp().catch((error: Error) => {
  // eslint-disable-next-line no-console
  console.log(`Failed to render application: ${error.message}`);
});
