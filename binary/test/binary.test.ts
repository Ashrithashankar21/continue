import { SerializedContinueConfig } from "core";
// import Mock from "core/llm/llms/Mock.js";
import { FromIdeProtocol, ToIdeProtocol } from "core/protocol/index.js";
import FileSystemIde from "core/util/filesystem";
import { IMessenger } from "core/util/messenger";
import { ReverseMessageIde } from "core/util/reverseMessageIde";
import * as vscode from 'vscode';
import {
  ChildProcessWithoutNullStreams,
  execSync,
  spawn,
} from "node:child_process";
import path from "path";
import {
  CoreBinaryMessenger,
  CoreBinaryTcpMessenger,
} from "../src/IpcMessenger";

// jest.setTimeout(100_000);

const USE_TCP = false;

function autodetectPlatformAndArch() {
  const platform = {
    aix: "linux",
    darwin: "darwin",
    freebsd: "linux",
    linux: "linux",
    openbsd: "linux",
    sunos: "linux",
    win32: "win32",
    android: "linux",
    cygwin: "win32",
    netbsd: "linux",
    haiku: "linux",
  }[process.platform];
  const arch = {
    arm: "arm64",
    arm64: "arm64",
    ia32: "x64",
    loong64: "arm64",
    mips: "arm64",
    mipsel: "arm64",
    ppc: "x64",
    ppc64: "x64",
    riscv64: "arm64",
    s390: "x64",
    s390x: "x64",
    x64: "x64",
  }[process.arch];
  return [platform, arch];
}

const CONTINUE_GLOBAL_DIR = path.join(__dirname, "..", ".continue");
async function initializeContinueGlobalDir() {
  const continueGlobalDirUri = vscode.Uri.file(CONTINUE_GLOBAL_DIR);

  try {
    const dirStat = await vscode.workspace.fs.stat(continueGlobalDirUri);
    if (dirStat) {
      await vscode.workspace.fs.delete(continueGlobalDirUri, { recursive: true });
    }
  } catch (error) {
    if ((error as vscode.FileSystemError).code !== 'FileNotFound') {
      console.error('Error checking or deleting directory:', error);
    }
  }

  try {
    await vscode.workspace.fs.createDirectory(continueGlobalDirUri);
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Call the function to ensure the directory is initialized
initializeContinueGlobalDir();

