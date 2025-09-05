#!/usr/bin/env bun
import { transform } from "@svgr/core";
import fs from "fs";
import path from "path";

const iconsDir = path.resolve("icons"); // raw svg folder
const outputDir = path.resolve("components/icons"); // tsx output

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let indexExports = "";

for (const file of fs.readdirSync(iconsDir)) {
  if (path.extname(file) === ".svg") {
    const svgCode = fs.readFileSync(path.join(iconsDir, file), "utf8");

    const componentName = path
      .basename(file, ".svg")
      .replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());

    let tsxCode = await transform(
      svgCode,
      {
        typescript: true,
        icon: true,
        jsxRuntime: "automatic",
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              name: "removeAttrs",
              params: { attrs: "(width|height|fill)" },
            },
          ],
        },
        replaceAttrValues: {
          none: "currentColor",
        },
      },
      { componentName },
    );

    // Inject our default props directly into <svg>
    tsxCode = tsxCode.replace("<svg", `<svg fill="currentColor"`);

    fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), tsxCode);

    indexExports += `export { default as ${componentName} } from './${componentName}';\n`;
    console.log(`✅ Converted: ${file} → ${componentName}.tsx`);
  }
}

// Write central export file
fs.writeFileSync(path.join(outputDir, "index.ts"), indexExports);
console.log("📦 Generated index.ts");
