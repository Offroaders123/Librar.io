// This function will return an object that represents the folder structure for the top-level FileSystemHandles that you pass into it.
import getFileSystemHandlesFromDirectory from "./getFileSystemHandlesFromDirectory.js";

export default async function getDirectoryTreeFromFileSystemHandles(fileSystemHandles){
  const entries = {};
  fileSystemHandles.forEach(handle => entries[handle.name] = handle);
  const listo = Object.keys(entries).sort((current,next) => {
    current = current.toLowerCase().replace(/^The\s/i,"");
    next = next.toLowerCase().replace(/^The\s/i,"");
    if (current < next) return -1;
    if (current > next) return 1;
    return 0;
  });
  const sorted = {};
  for await (const entryName of listo){
    const entry = entries[entryName];
    const kind = entry.kind;
    sorted[entryName] = (kind === "directory") ? await getDirectoryTreeFromFileSystemHandles(await getFileSystemHandlesFromDirectory(entry)) : entry;
  }
  return sorted;
}