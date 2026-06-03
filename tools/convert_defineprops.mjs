import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { parse } from "@vue/compiler-sfc";

const root = process.cwd();

function normalizeTypeText(node, sourceFile) {
  if (!node) return "any";

  if (ts.isTypeReferenceNode(node)) {
    const typeName = node.typeName.getText(sourceFile);
    const typeArgs = node.typeArguments?.map((arg) =>
      normalizeTypeText(arg, sourceFile),
    );

    if (typeName === "PropType") {
      return typeArgs?.[0] ?? "any";
    }

    if (typeName === "ZodType") {
      return "ZodType";
    }

    if (typeName === "Ref") {
      return typeArgs?.length ? `Ref<${typeArgs.join(", ")}>` : "Ref<any>";
    }

    return typeArgs?.length ? `${typeName}<${typeArgs.join(", ")}>` : typeName;
  }

  if (ts.isUnionTypeNode(node)) {
    return node.types
      .map((type) => normalizeTypeText(type, sourceFile))
      .join(" | ");
  }

  return node.getText(sourceFile);
}

function inferTypeFromTypeExpression(node, sourceFile) {
  if (!node) return "any";

  if (ts.isAsExpression(node)) {
    const typeNode = node.type;
    return normalizeTypeText(typeNode, sourceFile);
  }

  if (ts.isArrayLiteralExpression(node)) {
    const members = node.elements.map((element) =>
      inferTypeFromTypeExpression(element, sourceFile),
    );
    return members.join(" | ");
  }

  if (
    ts.isTypeReferenceNode(node) &&
    ts.isIdentifier(node.typeName) &&
    node.typeName.text === "PropType"
  ) {
    const typeArg = node.typeArguments?.[0];
    return typeArg ? normalizeTypeText(typeArg, sourceFile) : "any";
  }

  if (
    ts.isTypeReferenceNode(node) &&
    ts.isIdentifier(node.typeName) &&
    node.typeName.text === "ZodType"
  ) {
    return "ZodType";
  }

  if (ts.isIdentifier(node)) {
    if (node.text === "undefined") return "any";
    switch (node.text) {
      case "String":
        return "string";
      case "Number":
        return "number";
      case "Boolean":
        return "boolean";
      case "Array":
        return "any[]";
      case "Object":
        return "Record<string, any>";
      case "Function":
        return "(...args: any[]) => any";
      default:
        return node.text;
    }
  }

  return node.getText(sourceFile);
}

function getPropertyOption(node, key) {
  if (!ts.isObjectLiteralExpression(node)) return undefined;
  return node.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      ts.isIdentifier(property.name) &&
      property.name.text === key,
  )?.initializer;
}

function extractDefaultValue(node, inferredType) {
  const initializer = getPropertyOption(node, "default");
  if (!initializer) return undefined;

  const text = initializer.getText();
  if (
    inferredType.includes("ZodType") &&
    !text.startsWith("(") &&
    !text.startsWith("()")
  ) {
    return `() => ${text}`;
  }

  return text;
}

function isRequired(node) {
  const required = getPropertyOption(node, "required");
  return required ? required.kind === ts.SyntaxKind.TrueKeyword : false;
}

function transformFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = parse(source);

  if (!parsed.descriptor.scriptSetup) return;

  const script = parsed.descriptor.scriptSetup.content;
  const sourceFile = ts.createSourceFile(
    filePath,
    script,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const replacements = [];
  let hasDefineProps = false;

  function visit(node) {
    if (
      !ts.isCallExpression(node) ||
      !ts.isIdentifier(node.expression) ||
      node.expression.text !== "defineProps"
    ) {
      ts.forEachChild(node, visit);
      return;
    }

    if (
      !node.arguments.length ||
      !ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      return;
    }

    hasDefineProps = true;
    const propsObject = node.arguments[0];
    const defaults = [];
    const propLines = [];

    for (const property of propsObject.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name))
        continue;

      const propName = property.name.text;
      const optionObject = property.initializer;

      if (!ts.isObjectLiteralExpression(optionObject)) {
        propLines.push(`  ${propName}?: any;`);
        continue;
      }

      const typeNode = getPropertyOption(optionObject, "type");
      const inferredType = inferTypeFromTypeExpression(typeNode, sourceFile);
      const defaultValue = extractDefaultValue(optionObject, inferredType);

      propLines.push(
        `  ${propName}${!isRequired(optionObject) ? "?" : ""}: ${inferredType};`,
      );
      if (defaultValue) {
        defaults.push(`  ${propName}: ${defaultValue}`);
      }
    }

    const propsType = `\n  ${propLines.join("\n  ")}\n`;
    const replacementText =
      defaults.length > 0
        ? `withDefaults(defineProps<{${propsType}}>(), {\n${defaults.join(",\n")}\n})`
        : `defineProps<{${propsType}}>()`;

    replacements.push({
      start: node.getStart(sourceFile),
      end: node.getEnd(),
      text: replacementText,
    });
  }

  visit(sourceFile);

  if (!hasDefineProps) return;

  let finalScript = script;
  replacements.sort((a, b) => b.start - a.start);
  for (const replacement of replacements) {
    finalScript =
      finalScript.slice(0, replacement.start) +
      replacement.text +
      finalScript.slice(replacement.end);
  }

  fs.writeFileSync(
    filePath,
    source.replace(parsed.descriptor.scriptSetup.content, finalScript),
  );
}

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".vue")) {
      transformFile(fullPath);
    }
  }
}

scan(path.join(root, "src"));
