import * as path from "node:path";

import { runTests } from "@vscode/test-electron";
import { defaultConfig } from "core/config/default";
import * as vscode from "vscode";

export const testWorkspacePath = path.resolve(
  __dirname,
  "..",
  "src",
  "test",
  "fixtures",
  "test-workspace",
);

const continueGlobalDir = path.resolve(
  __dirname,
  "..",
  "src",
  "test",
  "fixtures",
  ".continue",
);

function setupTestWorkspace() {
  if (!vscode.workspace.fs.stat(vscode.Uri.file(testWorkspacePath))) {
    vscode.workspace.fs.delete(vscode.Uri.file(testWorkspacePath));
  }
  vscode.workspace.fs.createDirectory(vscode.Uri.file(testWorkspacePath));

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(testWorkspacePath, "test.py")),
    new TextEncoder().encode("print('Hello World!')"),
  );
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(testWorkspacePath, "index.js")),
    new TextEncoder().encode("console.log('Hello World!')"),
  );
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(testWorkspacePath, "test.py")),
    new TextEncoder().encode("print('Hello World!')"),
  );
  vscode.workspace.fs.createDirectory(
    vscode.Uri.file(path.join(testWorkspacePath, "test-folder")),
  );
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(testWorkspacePath, "test-folder", "test.js")),
    new TextEncoder().encode("console.log('Hello World!')"),
  );
}

function setupContinueGlobalDir() {
  if (!vscode.workspace.fs.stat(vscode.Uri.file(continueGlobalDir))) {
    vscode.workspace.fs.delete(vscode.Uri.file(continueGlobalDir));
  }
  vscode.workspace.fs.createDirectory(vscode.Uri.file(continueGlobalDir));
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path.join(continueGlobalDir, "config.json")),
    new TextEncoder().encode(
      JSON.stringify({
        ...defaultConfig,
        models: [
          {
            title: "Test Model",
            provider: "openai",
            model: "gpt-3.5-turbo",
            apiKey: "API_KEY",
          },
        ],
      }),
    ),
  );
}

function cleanupTestWorkspace() {
  if (!vscode.workspace.fs.stat(vscode.Uri.file(testWorkspacePath))) {
    vscode.workspace.fs.delete(vscode.Uri.file(testWorkspacePath));
  }
}

function cleanupContinueGlobalDir() {
  if (!vscode.workspace.fs.stat(vscode.Uri.file(continueGlobalDir))) {
    vscode.workspace.fs.delete(vscode.Uri.file(continueGlobalDir));
  }
}

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`

    // Assumes this file is in out/runTestOnVSCodeHost.js
    const extensionDevelopmentPath = path.resolve(__dirname, "../");
    console.log("extensionDevelopmentPath", extensionDevelopmentPath);

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(
      extensionDevelopmentPath,
      "out/mochaRunner",
    );

    const extensionTestsEnv = {
      NODE_ENV: "test",
      CONTINUE_GLOBAL_DIR: continueGlobalDir,
    };

    setupTestWorkspace();
    setupContinueGlobalDir();

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      extensionTestsEnv,
      launchArgs: [testWorkspacePath],
    });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  } finally {
    cleanupTestWorkspace();
    cleanupContinueGlobalDir();
  }
}

main();
