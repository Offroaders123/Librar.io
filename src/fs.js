/**
 * Extracts any FileSystemHandle objects present on a given DataTransfer object.
 * 
 * @param { DataTransfer } dataTransfer
*/
export async function dataTransferHandles(dataTransfer){
  const files = [...dataTransfer.items].filter(item => item.kind === "file");
  const handles = /** @type { FileSystemHandle[] } */ ((await Promise.all(files.map(item => item.getAsFileSystemHandle()))).filter(item => item !== null));
  return handles;
}

/**
 * Gets all FileSystemHandle objects from within a given FileSystemDirectoryHandle object. If the recursive flag is set to true, all of the handles will be flattened to a singular, single-depth array of all of the directory's file handles.
 * 
 * @param { FileSystemDirectoryHandle | FileSystemHandle[] } directoryHandle
*/
export async function readdir(directoryHandle,{ recursive = false } = {}){
  /** @type { RecursiveHandleArray } */
  const handles = [];
  for await (const handle of directoryHandle.values()){
    handles.push(handle.kind === "directory" && recursive === true ? await readdir(/** @type { FileSystemDirectoryHandle } */ (handle),{ recursive }) : /** @type { FileSystemHandle } */ (handle));
  }
  // @ts-expect-error
  return /** @type { FileSystemHandle[] | RecursiveHandleArray } */ (recursive === true ? handles.flat(Infinity) : handles);
}

/**
 * @typedef DirTree
 * @property { string } name
 * @property { DirTree[] } [value]
 * @property { FileSystemFileHandle } [handle]
*/

/**
 * Maps a RecursiveHandleArray into a symmetical object structure, but with directories represented as simple objects, and the children files being the data structure end points.
 * 
 * @param { FileSystemDirectoryHandle | FileSystemHandle[] } directoryHandle
*/
export async function dirtree(directoryHandle){
  const handles = /** @type { FileSystemHandle[] } */ (await readdir(directoryHandle));

  /** @type { DirTree[] } */
  const entries = await Promise.all(handles.map(async entry => {
    const { name, kind } = entry;
    const value = kind === "directory" ? await dirtree(/** @type { FileSystemDirectoryHandle } */ (entry)) : null;
    const handle = kind === "file" ? /** @type { FileSystemFileHandle } */ (entry) : null;

    return {
      name,
      ...value && ({ value }),
      ...handle && ({ handle })
    };
  }));

  return sortArray(entries);
}

/**
 * Sorts an array of DirTree objects by it's name key.
 * 
 * @param { DirTree[] } array
*/
function sortArray(array){
  return array.sort((first,second) => {
    const left = formatKey(first.name);
    const right = formatKey(second.name);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
}

/**
 * Returns a sanitized version of a given key string, without any "A" or "The" prefixes.
 * 
 * @param { string } key
*/
function formatKey(key){
  return key.toLowerCase().replace(/^(The|A)\s/i,"");
}