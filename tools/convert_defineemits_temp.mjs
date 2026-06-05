import { parse } from "@vue/compiler-sfc";
import fs from "node:fs";
import path from "node:path";

function collectEmitArgs(script) {
  const map = new Map();
  const re = /emit\(\s*['"]([^'"]+)['"](?:\s*,\s*([^\)]*))?\)/g;
  let m;
  while ((m = re.exec(script))) {
    const event = m[1];
    const args = m[2] ? m[2].split(",").filter(Boolean).length : 0;
    map.set(event, Math.max(map.get(event) ?? 0, args));
  }
  return map;
}

function transformFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = parse(source);
  if (!parsed.descriptor.scriptSetup) return;

  const script = parsed.descriptor.scriptSetup.content;
  const emitArgs = collectEmitArgs(script);

  const updated = script.replace(
    /defineEmits\(\s*\[(.*?)\]\s*\)/gs,
    (full, body) => {
      const events = [...body.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
      if (!events.length) return full;
      const lines = events.map((name) => {
        const count = emitArgs.get(name) || 0;
        const tuple = count > 0 ? `[arg1: any]` : "[]";
        return `  ${JSON.stringify(name)}: ${tuple};`;
      });
      return `defineEmits<\n{\n${lines.join("\n")}\n}>()`;
    },
  );

  if (updated !== script) {
    fs.writeFileSync(
      filePath,
      source.replace(parsed.descriptor.scriptSetup.content, updated),
    );
  }
}

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.name.endsWith(".vue")) {
      transformFile(fullPath);
    }
  }
}

scan(path.join(process.cwd(), "src"));
