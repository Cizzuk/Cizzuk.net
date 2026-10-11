export const log = (message) => {
  if (process.stdout && process.stdout.isTTY) {
    console.log(`\x1b[34m[build]\x1b[0m ${message}`);
  } else {
    console.log(`[build] ${message}`);
  }
};
