import * as vscode from "vscode";

const directories = [
  // gui
  "./gui/node_modules",
  "./gui/out",
  "./gui/dist",
  // core
  "./core/node_modules",
  "./core/dist",
  // extensions/vscode
  "./extensions/vscode/node_modules",
  "./extensions/vscode/bin",
  "./extensions/vscode/build",
  "./extensions/vscode/out",
  // binary
  "./binary/node_modules",
  "./binary/bin",
  "./binary/dist",
  "./binary/out",
];

directories.forEach((dir) => {
  if (vscode.workspace.fs.stat(vscode.Uri.file(dir))) {
    vscode.workspace.fs.delete(vscode.Uri.file(dir));
    console.log(`Removed ${dir}`);
  } else {
    console.log(`${dir} not found`);
  }
});
