import { Disposable, EventEmitter } from "vscode";

const UPDATE_INTERVAL_MS = 1000;

declare global {
  interface Navigator {
    getBattery?: () => Promise<{ charging: boolean, level?: number }>;
  }
}

export class Battery implements Disposable {
  private updateTimeout: NodeJS.Timeout | undefined;
  private readonly onChangeACEmitter = new EventEmitter<boolean>();
  private readonly onChangeLevelEmitter = new EventEmitter<number>();
  private acConnected: boolean = true;
  private level = 100;

  constructor() {
    this.updateTimeout = setInterval(() => this.update(), UPDATE_INTERVAL_MS);
  }

  dispose() {
    if (this.updateTimeout) {
      clearInterval(this.updateTimeout);
    }
  }

  private async update() {
    let level = this.level;
    let isACConnected = this.acConnected;

    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      level = battery.level !== undefined ? battery.level * 100 : 100;
      isACConnected = battery.charging;
    }

    if (isACConnected !== this.acConnected) {
      this.acConnected = isACConnected;
      this.onChangeACEmitter.fire(isACConnected);
    }
    if (level !== this.level) {
      this.level = level;
      this.onChangeLevelEmitter.fire(level);
    }
  }

  public getLevel(): number {
    return this.level;
  }

  public isACConnected(): boolean {
    return this.acConnected;
  }

  public readonly onChangeLevel = this.onChangeLevelEmitter.event;
  public readonly onChangeAC = this.onChangeACEmitter.event;
}
