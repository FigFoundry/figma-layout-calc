// https://www.figma.com/plugin-docs/manifest/

export default {
  name: "Layout Calculator",
  id: "1454833650234213095",
  api: "1.0.0",
  editorType: ["figma", "figjam"],
  main: "./canvas.js",
  ui: "./plugin.html",
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["none"],
  },
};
