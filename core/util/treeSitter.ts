import * as path from "node:path";

import * as vscode from "vscode";
import Parser, { Language } from "web-tree-sitter";

export enum LanguageName {
  CPP = "cpp",
  C_SHARP = "c_sharp",
  C = "c",
  CSS = "css",
  PHP = "php",
  BASH = "bash",
  JSON = "json",
  TYPESCRIPT = "typescript",
  TSX = "tsx",
  ELM = "elm",
  JAVASCRIPT = "javascript",
  PYTHON = "python",
  ELISP = "elisp",
  ELIXIR = "elixir",
  GO = "go",
  EMBEDDED_TEMPLATE = "embedded_template",
  HTML = "html",
  JAVA = "java",
  LUA = "lua",
  OCAML = "ocaml",
  QL = "ql",
  RESCRIPT = "rescript",
  RUBY = "ruby",
  RUST = "rust",
  SYSTEMRDL = "systemrdl",
  TOML = "toml",
  SOLIDITY = "solidity",
}

export const supportedLanguages: { [key: string]: LanguageName } = {
  cpp: LanguageName.CPP,
  hpp: LanguageName.CPP,
  cc: LanguageName.CPP,
  cxx: LanguageName.CPP,
  hxx: LanguageName.CPP,
  cp: LanguageName.CPP,
  hh: LanguageName.CPP,
  inc: LanguageName.CPP,
  // Depended on this PR: https://github.com/tree-sitter/tree-sitter-cpp/pull/173
  // ccm: LanguageName.CPP,
  // c++m: LanguageName.CPP,
  // cppm: LanguageName.CPP,
  // cxxm: LanguageName.CPP,
  cs: LanguageName.C_SHARP,
  c: LanguageName.C,
  h: LanguageName.C,
  css: LanguageName.CSS,
  php: LanguageName.PHP,
  phtml: LanguageName.PHP,
  php3: LanguageName.PHP,
  php4: LanguageName.PHP,
  php5: LanguageName.PHP,
  php7: LanguageName.PHP,
  phps: LanguageName.PHP,
  "php-s": LanguageName.PHP,
  bash: LanguageName.BASH,
  sh: LanguageName.BASH,
  json: LanguageName.JSON,
  ts: LanguageName.TYPESCRIPT,
  mts: LanguageName.TYPESCRIPT,
  cts: LanguageName.TYPESCRIPT,
  tsx: LanguageName.TSX,
  // vue: LanguageName.VUE,  // tree-sitter-vue parser is broken
  // The .wasm file being used is faulty, and yaml is split line-by-line anyway for the most part
  // yaml: LanguageName.YAML,
  // yml: LanguageName.YAML,
  elm: LanguageName.ELM,
  js: LanguageName.JAVASCRIPT,
  jsx: LanguageName.JAVASCRIPT,
  mjs: LanguageName.JAVASCRIPT,
  cjs: LanguageName.JAVASCRIPT,
  py: LanguageName.PYTHON,
  ipynb: LanguageName.PYTHON,
  pyw: LanguageName.PYTHON,
  pyi: LanguageName.PYTHON,
  el: LanguageName.ELISP,
  emacs: LanguageName.ELISP,
  ex: LanguageName.ELIXIR,
  exs: LanguageName.ELIXIR,
  go: LanguageName.GO,
  eex: LanguageName.EMBEDDED_TEMPLATE,
  heex: LanguageName.EMBEDDED_TEMPLATE,
  leex: LanguageName.EMBEDDED_TEMPLATE,
  html: LanguageName.HTML,
  htm: LanguageName.HTML,
  java: LanguageName.JAVA,
  lua: LanguageName.LUA,
  ocaml: LanguageName.OCAML,
  ml: LanguageName.OCAML,
  mli: LanguageName.OCAML,
  ql: LanguageName.QL,
  res: LanguageName.RESCRIPT,
  resi: LanguageName.RESCRIPT,
  rb: LanguageName.RUBY,
  erb: LanguageName.RUBY,
  rs: LanguageName.RUST,
  rdl: LanguageName.SYSTEMRDL,
  toml: LanguageName.TOML,
  sol: LanguageName.SOLIDITY,

  // jl: LanguageName.JULIA,
  // swift: LanguageName.SWIFT,
  // kt: LanguageName.KOTLIN,
  // scala: LanguageName.SCALA,
};

export const IGNORE_PATH_PATTERNS: Partial<Record<LanguageName, RegExp[]>> = {
  [LanguageName.TYPESCRIPT]: [/.*node_modules/],
  [LanguageName.JAVASCRIPT]: [/.*node_modules/],
};

export async function getParserForFile(filepath: string) {
  try {
    await Parser.init();
    const parser = new Parser();

    const language = await getLanguageForFile(filepath);
    if (!language) {
      return undefined;
    }

    parser.setLanguage(language);

    return parser;
  } catch (e) {
    console.debug("Unable to load language for file", filepath, e);
    return undefined;
  }
}

// Loading the wasm files to create a Language object is an expensive operation and with
// sufficient number of files can result in errors, instead keep a map of language name
// to Language object
const nameToLanguage = new Map<string, Language>();

export async function getLanguageForFile(
  filepath: string,
): Promise<Language | undefined> {
  try {
    await Parser.init();
    const extension = path.extname(filepath).slice(1);

    const languageName = supportedLanguages[extension];
    if (!languageName) {
      return undefined;
    }
    let language = nameToLanguage.get(languageName);

    if (!language) {
      language = await loadLanguageForFileExt(extension);
      nameToLanguage.set(languageName, language);
    }
    return language;
  } catch (e) {
    console.debug("Unable to load language for file", filepath, e);
    return undefined;
  }
}

export const getFullLanguageName = (filepath: string) => {
  return supportedLanguages[filepath.split(".").pop() ?? ""];
};

export async function getQueryForFile(
  filepath: string,
  queryPath: string,
): Promise<Parser.Query | undefined> {
  const language = await getLanguageForFile(filepath);
  if (!language) {
    return undefined;
  }

  const sourcePath = path.join(
    __dirname,
    "..",
    ...(process.env.NODE_ENV === "test"
      ? ["extensions", "vscode", "tree-sitter"]
      : ["tree-sitter"]),
    queryPath,
  );
  if (!vscode.workspace.fs.stat(vscode.Uri.file(sourcePath)).then(() => true)) {
    return undefined;
  }
  const querySource = vscode.workspace.fs
    .readFile(vscode.Uri.file(sourcePath))
    .toString();

  const query = language.query(querySource);
  return query;
}

async function loadLanguageForFileExt(
  fileExtension: string,
): Promise<Language> {
  const wasmPath = path.join(
    __dirname,
    ...(process.env.NODE_ENV === "test"
      ? ["node_modules", "tree-sitter-wasms", "out"]
      : ["tree-sitter-wasms"]),
    `tree-sitter-${supportedLanguages[fileExtension]}.wasm`,
  );
  return await Parser.Language.load(wasmPath);
}
