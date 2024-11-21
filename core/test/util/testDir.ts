import os from "os";
import path from "path";

import * as vscode from "vscode";

// Want this outside of the git repository so we can change branches in tests
export const TEST_DIR = path.join(os.tmpdir(), "testDir");

export async function setUpTestDir() {
  try {
    if (await vscode.workspace.fs.stat(vscode.Uri.file(TEST_DIR))) {
      await vscode.workspace.fs.delete(vscode.Uri.file(TEST_DIR), {
        recursive: true,
      });
    }
  } catch {
    /* Directory does not exist, no need to delete */
  }

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(TEST_DIR));
}

export async function tearDownTestDir() {
  try {
    await vscode.workspace.fs.delete(vscode.Uri.file(TEST_DIR), {
      recursive: true,
    });
  } catch {
    /* Directory does not exist, no need to delete */
  }
}

export async function addToTestDir(paths: (string | [string, string])[]) {
  for (const p of paths) {
    const filepath = path.join(TEST_DIR, Array.isArray(p) ? p[0] : p);
    await vscode.workspace.fs.createDirectory(
      vscode.Uri.file(path.dirname(filepath)),
    );
    if (Array.isArray(p)) {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(filepath),
        new TextEncoder().encode(p[1]),
      );
    } else if (p.endsWith("/")) {
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(filepath));
    } else {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(filepath),
        new TextEncoder().encode(""),
      );
    }
  }
}
