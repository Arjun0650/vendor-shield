const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "util-deprecate",
  "node.js"
);

if (!fs.existsSync(target)) {
  fs.mkdirSync(path.dirname(target), {
    recursive: true
  });

  fs.writeFileSync(
    target,
    "module.exports = require('util').deprecate;\n"
  );

  console.log("Created util-deprecate/node.js");
} else {
  console.log("util-deprecate/node.js already exists");
}
