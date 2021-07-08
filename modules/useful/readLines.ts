const textDecoder = new TextDecoder();

export async function* readLines(file: Deno.File) {
  const buffer = new Uint8Array(2 ** 14);
  let textBuffer = "";

  while (true) {
    const numberOfBytesRead = await Deno.read(file.rid, buffer);
    if (numberOfBytesRead === null) {
      break;
    }
    const portionBuffer = buffer.slice(0, numberOfBytesRead);
    let portionText = textDecoder.decode(portionBuffer);
    while (true) {
      const indexOfNextLine = portionText.indexOf("\n");
      if (indexOfNextLine === -1) {
        textBuffer += portionText
        break;
      }
      const lastPortionText = portionText.slice(0, indexOfNextLine);
      const total = textBuffer + lastPortionText;
      yield total;
      portionText = portionText.slice(indexOfNextLine + 1);
      textBuffer = "";
    }
  }
  if (textBuffer !== '') {
    yield textBuffer;
  }
}
