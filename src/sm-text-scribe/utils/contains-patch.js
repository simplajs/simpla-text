// Patch document.contains
if (!document.contains) {
  document.contains = (...args) => document.body.contains(...args);
}
