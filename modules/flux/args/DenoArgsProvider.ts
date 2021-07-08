export class DenoArgsProvider {
  public provide(): string[] {
    return [...Deno.args];
  }
}
