import * as os from "os";
import * as path from "path";

import * as JSONC from "comment-json";
import dotenv from "dotenv";
import * as vscode from "vscode";

import { IdeType, SerializedContinueConfig } from "../";
import { defaultConfig, defaultConfigJetBrains } from "../config/default";
import Types from "../config/types";

dotenv.config();

const CONTINUE_GLOBAL_DIR =
  process.env.CONTINUE_GLOBAL_DIR ?? path.join(os.homedir(), ".continue");

export const DEFAULT_CONFIG_TS_CONTENTS = `export function modifyConfig(config: Config): Config {
  return config;
}`;

export async function getChromiumPath(): Promise<string> {
  return path.join(await getContinueUtilsPath(), ".chromium-browser-snapshots");
}

export async function getContinueUtilsPath(): Promise<string> {
  const utilsPath = path.join(getContinueGlobalPath().toString(), ".utils");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(utilsPath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(utilsPath));
  }
  return utilsPath;
}

export async function getGlobalContinueIgnorePath(): Promise<string> {
  const continueIgnorePath = path.join(
    getContinueGlobalPath().toString(),
    ".continueignore",
  );
  if (
    !vscode.workspace.fs
      .stat(vscode.Uri.file(continueIgnorePath))
      .then(() => true)
  ) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(continueIgnorePath),
      new TextEncoder().encode(""),
    );
  }
  return continueIgnorePath;
}

export async function getContinueGlobalPath() {
  // This is ~/.continue on mac/linux
  const continuePath = CONTINUE_GLOBAL_DIR;
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(continuePath)).then(() => true)
  ) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(continuePath));
    return continuePath;
  }
}

export async function getSessionsFolderPath() {
  const sessionsPath = path.join(
    getContinueGlobalPath().toString(),
    "sessions",
  );
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(sessionsPath)).then(() => true)
  ) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(sessionsPath));
    return sessionsPath;
  }
}

export async function getIndexFolderPath() {
  const indexPath = path.join(getContinueGlobalPath().toString(), "index");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(indexPath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(indexPath));
  }
  return indexPath;
}

export function getGlobalContextFilePath(): string {
  return path.join(getIndexFolderPath().toString(), "globalContext.json");
}

export function getSessionFilePath(sessionId: string): string {
  return path.join(getSessionsFolderPath().toString(), `${sessionId}.json`);
}

export async function getSessionsListPath() {
  const filepath = path.join(
    getSessionsFolderPath().toString(),
    "sessions.json",
  );
  if (!vscode.workspace.fs.stat(vscode.Uri.file(filepath)).then(() => true)) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(filepath),
      new TextEncoder().encode(JSON.stringify([])),
    );
  }
  return filepath;
}

export async function getConfigJsonPath(ideType: IdeType = "vscode") {
  const p = path.join(getContinueGlobalPath().toString(), "config.json");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(p)).then(() => true)) {
    if (ideType === "jetbrains") {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(p),
        new TextEncoder().encode(
          JSON.stringify(defaultConfigJetBrains, null, 2),
        ),
      );
    } else {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(p),
        new TextEncoder().encode(JSON.stringify(defaultConfig, null, 2)),
      );
    }
  }
  return p;
}

export async function getConfigTsPath() {
  const p = path.join(getContinueGlobalPath().toString(), "config.ts");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(p)).then(() => true)) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(p),
      new TextEncoder().encode(DEFAULT_CONFIG_TS_CONTENTS),
    );
  }

  const typesPath = path.join(getContinueGlobalPath().toString(), "types");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(typesPath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(typesPath));
  }
  const corePath = path.join(typesPath, "core");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(corePath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(corePath));
  }
  const packageJsonPath = path.join(
    getContinueGlobalPath().toString(),
    "package.json",
  );
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(packageJsonPath)).then(() => true)
  ) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(packageJsonPath),
      new TextEncoder().encode(
        JSON.stringify({
          name: "continue-config",
          version: "1.0.0",
          description: "My Continue Configuration",
          main: "config.js",
        }),
      ),
    );
  }

  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(corePath, "index.d.ts")),
    new TextEncoder().encode(Types),
  );
  return p;
}

export function getConfigJsPath(): string {
  // Do not create automatically
  return path.join(getContinueGlobalPath().toString(), "out", "config.js");
}

export async function getTsConfigPath() {
  const tsConfigPath = path.join(
    getContinueGlobalPath().toString(),
    "tsconfig.json",
  );
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(tsConfigPath)).then(() => true)
  ) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(tsConfigPath),
      new TextEncoder().encode(
        JSON.stringify(
          {
            compilerOptions: {
              target: "ESNext",
              useDefineForClassFields: true,
              lib: ["DOM", "DOM.Iterable", "ESNext"],
              allowJs: true,
              skipLibCheck: true,
              esModuleInterop: false,
              allowSyntheticDefaultImports: true,
              strict: true,
              forceConsistentCasingInFileNames: true,
              module: "System",
              moduleResolution: "Node",
              noEmit: false,
              noEmitOnError: false,
              outFile: "./out/config.js",
              typeRoots: ["./node_modules/@types", "./types"],
            },
            include: ["./config.ts"],
          },
          null,
          2,
        ),
      ),
    );
  }
  return tsConfigPath;
}

export async function getContinueRcPath() {
  // Disable indexing of the config folder to prevent infinite loops
  const continuercPath = path.join(
    getContinueGlobalPath().toString(),
    ".continuerc.json",
  );
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(continuercPath)).then(() => true)
  ) {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(continuercPath),
      new TextEncoder().encode(
        JSON.stringify(
          {
            disableIndexing: true,
          },
          null,
          2,
        ),
      ),
    );
  }
  return continuercPath;
}

export async function devDataPath() {
  const sPath = path.join(getContinueGlobalPath().toString(), "dev_data");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(sPath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(sPath));
  }
  return sPath;
}

export function getDevDataSqlitePath(): string {
  return path.join(devDataPath().toString(), "devdata.sqlite");
}

export function getDevDataFilePath(fileName: string): string {
  return path.join(devDataPath().toString(), `${fileName}.jsonl`);
}

export async function editConfigJson(
  callback: (config: SerializedContinueConfig) => SerializedContinueConfig,
) {
  const config = vscode.workspace.fs.readFile(
    vscode.Uri.file(getConfigJsonPath().toString()),
  );
  let configJson = JSONC.parse(config.toString());
  // Check if it's an object
  if (typeof configJson === "object" && configJson !== null) {
    configJson = callback(configJson as any) as any;
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(getConfigJsonPath().toString()),
      new TextEncoder().encode(JSONC.stringify(configJson, null, 2)),
    );
  } else {
    console.warn("config.json is not a valid object");
  }
}

async function getMigrationsFolderPath() {
  const migrationsPath = path.join(
    getContinueGlobalPath().toString(),
    ".migrations",
  );
  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(migrationsPath)).then(() => true)
  ) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(migrationsPath));
  }
  return migrationsPath;
}

export async function migrate(
  id: string,
  callback: () => void | Promise<void>,
  onAlreadyComplete?: () => void,
) {
  if (process.env.NODE_ENV === "test") {
    return await Promise.resolve(callback());
  }

  const migrationsPath = getMigrationsFolderPath();
  const migrationPath = path.join((await migrationsPath).toString(), id);

  if (
    !vscode.workspace.fs.stat(vscode.Uri.file(migrationPath)).then(() => true)
  ) {
    try {
      console.log(`Running migration: ${id}`);

      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(migrationPath),
        new TextEncoder().encode(""),
      );
      await Promise.resolve(callback());
    } catch (e) {
      console.warn(`Migration ${id} failed`, e);
    }
  } else if (onAlreadyComplete) {
    onAlreadyComplete();
  }
}

export function getIndexSqlitePath(): string {
  return path.join(getIndexFolderPath().toString(), "index.sqlite");
}

export function getLanceDbPath(): string {
  return path.join(getIndexFolderPath().toString(), "lancedb");
}

export function getTabAutocompleteCacheSqlitePath(): string {
  return path.join(getIndexFolderPath().toString(), "autocompleteCache.sqlite");
}

export function getDocsSqlitePath(): string {
  return path.join(getIndexFolderPath().toString(), "docs.sqlite");
}

export async function getRemoteConfigsFolderPath() {
  const dir = path.join(getContinueGlobalPath().toString(), ".configs");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(dir)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(dir));
  }
  return dir;
}

export async function getPathToRemoteConfig(remoteConfigServerUrl: string) {
  let url: URL | undefined = undefined;
  try {
    url =
      typeof remoteConfigServerUrl !== "string" || remoteConfigServerUrl === ""
        ? undefined
        : new URL(remoteConfigServerUrl);
  } catch (e) {}
  const dir = path.join(
    getRemoteConfigsFolderPath().toString(),
    url?.hostname ?? "None",
  );
  if (!vscode.workspace.fs.stat(vscode.Uri.file(dir)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(dir));
  }
  return dir;
}

export async function internalBetaPathExists(): Promise<boolean> {
  const sPath = path.join(getContinueGlobalPath().toString(), ".internal_beta");
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(sPath));
    return true;
  } catch {
    return false;
  }
}

export function getConfigJsonPathForRemote(
  remoteConfigServerUrl: string,
): string {
  return path.join(
    getPathToRemoteConfig(remoteConfigServerUrl).toString(),
    "config.json",
  );
}

export function getConfigJsPathForRemote(
  remoteConfigServerUrl: string,
): string {
  return path.join(
    getPathToRemoteConfig(remoteConfigServerUrl).toString(),
    "config.js",
  );
}

export async function getContinueDotEnv(): Promise<{ [key: string]: string }> {
  const filepath = path.join(await getContinueGlobalPath().toString(), ".env");

  try {
    const fileContent = await vscode.workspace.fs.readFile(
      vscode.Uri.file(filepath),
    );
    return dotenv.parse(fileContent.toString());
  } catch {
    return {};
  }
}

export async function getLogsDirPath() {
  const logsPath = path.join(getContinueGlobalPath().toString(), "logs");
  if (!vscode.workspace.fs.stat(vscode.Uri.file(logsPath)).then(() => true)) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(logsPath));
  }
  return logsPath;
}

export function getCoreLogsPath(): string {
  return path.join(getLogsDirPath().toString(), "core.log");
}

export function getPromptLogsPath(): string {
  return path.join(getLogsDirPath().toString(), "prompt.log");
}

export function getGlobalPromptsPath(): string {
  return path.join(getContinueGlobalPath().toString(), "prompts");
}

export async function readAllGlobalPromptFiles(
  folderPath: string = getGlobalPromptsPath(),
) {
  if (!vscode.workspace.fs.stat(vscode.Uri.file(folderPath)).then(() => true)) {
    return [];
  }
  const files = await vscode.workspace.fs.readDirectory(
    vscode.Uri.file(folderPath),
  );
  const promptFiles: { path: string; content: string }[] = [];
  files.forEach(async (file) => {
    const filepath = path.join(folderPath, file.toString());
    const stats = vscode.workspace.fs.stat(vscode.Uri.file(filepath)) as any;

    if (stats.isDirectory()) {
      const nestedPromptFiles = readAllGlobalPromptFiles(filepath);
      promptFiles.push(...(await nestedPromptFiles));
    } else {
      const content = vscode.workspace.fs
        .readFile(vscode.Uri.file(filepath))
        .toString();
      promptFiles.push({ path: filepath, content });
    }
  });

  return promptFiles;
}

export function getRepoMapFilePath(): string {
  return path.join(getContinueUtilsPath().toString(), "repo_map.txt");
}

export function getEsbuildBinaryPath(): string {
  return path.join(getContinueUtilsPath().toString(), "esbuild");
}

export async function setupInitialDotContinueDirectory() {
  const devDataTypes = [
    "chat",
    "autocomplete",
    "quickEdit",
    "tokens_generated",
  ];

  for (const type of devDataTypes) {
    const devDataPath = getDevDataFilePath(type);
    if (
      !(await vscode.workspace.fs
        .stat(vscode.Uri.file(devDataPath))
        .then(() => true))
    ) {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(devDataPath),
        new TextEncoder().encode(""),
      );
    }
  }
}
