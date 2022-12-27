/**
 * Extracts any FileSystemHandle objects present on a given DataTransfer object.
 * 
 * @param { DataTransfer } dataTransfer
*/
export async function dataTransferHandles({ items }){
  const files = [...items].filter(item => item.kind === "file");
  const handles = await Promise.all(files.map(item => item.getAsFileSystemHandle()));
  const result = handles.filter(/** @returns { handle is FileSystemHandle } */ handle => handle !== null);
  return result;
}

/**
 * Gets all FileSystemHandle objects from a FileSystemDirectoryHandle object.
 * 
 * @param { FileSystemDirectoryHandle } directoryHandle
*/
export async function readdir(directoryHandle){
  /** @type { FileSystemHandle[] } */
  const handles = [];

  for await (const handle of directoryHandle.values()){
    handles.push(handle);
  }

  return handles;
}

/**
 * @typedef DirTree
 * @property { string } name
 * @property { DirTree[] | FileSystemFileHandle } value
*/

/**
 * Maps a RecursiveHandleArray into a symmetical object structure, but with directories represented as simple objects, and the children files being the data structure end points.
 * 
 * @param { FileSystemDirectoryHandle | FileSystemHandle[] } directoryHandle
*/
export async function dirtree(directoryHandle){
  const handles = (directoryHandle instanceof FileSystemDirectoryHandle) ? await readdir(directoryHandle) : directoryHandle;

  const entries = await Promise.all(handles.map(async entry => {
    const { name } = entry;
    const value = (entry instanceof FileSystemDirectoryHandle) ? await dirtree(entry) : /** @type { FileSystemFileHandle } */ (entry);
    /** @type { DirTree } */
    const result = { name, value };
    return result;
  }));

  const result = sortArray(entries);

  return result;
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
 * Returns a sanitized version of a given key string, without any word prefixes. This is used to sort an array of DirTree objects by each entry's name property, alphabetically.
 * 
 * @param { string } key
*/
function formatKey(key){
  return key.toLowerCase().replace(/^(The|A)\s/i,"");
}