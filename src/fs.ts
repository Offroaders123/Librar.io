/**
 * Extracts any FileSystemHandle objects present on a given DataTransfer object.
*/
export async function dataTransferHandles({ items }: DataTransfer): Promise<FileSystemHandle[]> {
  const files = [...items].filter(item => item.kind === "file");
  const handles = await Promise.all(files.map(item => item.getAsFileSystemHandle()));
  return handles.filter((handle): handle is FileSystemHandle => handle !== null);
}

/**
 * Gets all FileSystemHandle objects from a FileSystemDirectoryHandle object.
*/
export async function readdir(directoryHandle: FileSystemDirectoryHandle): Promise<FileSystemHandle[]> {
  const handles: FileSystemHandle[] = [];

  for await (const handle of directoryHandle.values()){
    handles.push(handle);
  }

  return handles;
}

export interface DirTree {
  name: string;
  value: DirTree[] | FileSystemFileHandle;
}

/**
 * Maps a RecursiveHandleArray into a symmetical object structure, but with directories represented as simple objects, and the children files being the data structure end points.
*/
export async function dirtree(directoryHandle: FileSystemDirectoryHandle | FileSystemHandle[]): Promise<DirTree[]> {
  const handles = (directoryHandle instanceof FileSystemDirectoryHandle) ? await readdir(directoryHandle) : directoryHandle;

  const entries: DirTree[] = await Promise.all(handles.map(async entry => {
    const { name } = entry;
    const value: DirTree["value"] = (entry instanceof FileSystemDirectoryHandle) ? await dirtree(entry) : entry as FileSystemFileHandle;
    return { name, value };
  }));

  return sortArray(entries);
}

/**
 * Sorts an array of DirTree objects by it's name key.
*/
function sortArray(array: DirTree[]): DirTree[] {
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
*/
function formatKey(key: string): string {
  return key.toLowerCase().replace(/^(The|A)\s/i,"");
}