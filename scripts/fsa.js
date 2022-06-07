export async function dataTransferHandles(dataTransfer){
  const files = [...dataTransfer.items].filter(item => item.kind === "file");
  const handles = (await Promise.all(files.map(item => item.getAsFileSystemHandle()))).filter(item => item !== undefined);
  return handles;
}

export default { dataTransferHandles, [Symbol.toStringTag]: "fsa" };