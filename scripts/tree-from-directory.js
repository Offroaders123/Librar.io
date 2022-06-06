// This function will return an object that represents the folder structure for the FileSystemDirectoryHandle that you pass into it.
import getFileSystemHandlesFromDirectory from "./handles-from-directory.js";

export default async function getDirectoryTreeFromDirectory(fileSystemDirectoryHandle){
  const fileSystemHandles = await getFileSystemHandlesFromDirectory(fileSystemDirectoryHandle);
  const entries = sortArray(await Promise.all(fileSystemHandles.map(async handle => {
    const value = (handle.kind === "directory") ? sortArray(await getDirectoryTreeFromDirectory(handle)) : null;
    const fileHandle = (handle.kind === "file") ? handle : null;
    return {
      name: handle.name,
      ...value && ({ value }), /* Only add the "value" key when the handle is a directory. It's not needed for files. */
      ...fileHandle && ({ handle: fileHandle }) /* Only add the "handle" key when the handle is a file. */
    };
  })));
  return entries;
}

function sortArray(array){
  return array.sort((left,right) => {
    left = formatKeyForSorting(left);
    right = formatKeyForSorting(right);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
}

function formatKeyForSorting(key){
  /* Temporarily added .name to be able to organize based on object keys */
  return key.name.toLowerCase().replace(/^(The|A)\s/i,"");
}