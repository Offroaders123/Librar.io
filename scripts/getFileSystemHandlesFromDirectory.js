// This function will return an array of FileSystemHandle objects from the FileSystemDirectoryHandle object that you pass into it.
export default async function getFileSystemHandlesFromDirectory(fileSystemDirectoryHandle){
  const fileSystemHandles = [];
  for await (const handle of fileSystemDirectoryHandle.values()) fileSystemHandles.push(handle);
  return fileSystemHandles;
}