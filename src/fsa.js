export async function dataTransferHandles(dataTransfer){
  const files = [...dataTransfer.items].filter(item => item.kind === "file");
  const handles = (await Promise.all(files.map(item => item.getAsFileSystemHandle()))).filter(item => item !== undefined);
  return handles;
}

export async function readdir(directoryHandle,{ recursive = false } = {}){
  const handles = [];
  for await (const handle of directoryHandle.values()){
    handles.push(handle.kind === "directory" && recursive === true ? await readdir(handle,{ recursive }) : handle);
  }
  return recursive === true ? handles.flat(Infinity) : handles;
}

export async function dirtree(directoryHandle){
  const handles = await readdir(directoryHandle);

  const entries = await Promise.all(handles.map(async entry => {
    const { name, kind } = entry;
    const value = kind === "directory" ? await dirtree(entry) : null;
    const handle = kind === "file" ? entry : null;

    return {
      name,
      ...value && ({ value }),
      ...handle && ({ handle })
    };
  }));

  return sortArray(entries);
}

function sortArray(array){
  return array.sort((left,right) => {
    left = formatKey(left.name);
    right = formatKey(right.name);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
}

function formatKey(key){
  return key.toLowerCase().replace(/^(The|A)\s/i,"");
}

export default { dataTransferHandles, readdir, dirtree, [Symbol.toStringTag]: "fsa" };