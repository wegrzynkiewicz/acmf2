export class ExitCodeManager {
  private code: number = 0;

  public get(): number {
    return this.code;
  }

  public set(code: number): void {
    this.code = code;
  }
}
