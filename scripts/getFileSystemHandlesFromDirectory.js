// This function will return an array of FileSystemHandle objects from the FileSystemDirectoryHandle object that you pass into it.
// Optionally, you can enable the recursive option, which will set the function behavior to automatically flatten all nested FileSystemDirectoryHandle objects down to the content inside of them.
// This makes it easier to iterate over all files within the top-level parent directory, including those inside of any child folders.
export default async function getFileSystemHandlesFromDirectory(fileSystemDirectoryHandle,{ recursive = false } = {}){
  const fileSystemHandles = [];
  for await (const handle of fileSystemDirectoryHandle.values()) fileSystemHandles.push((handle.kind === "directory" && recursive === true) ? await getFileSystemHandlesFromDirectory(handle,{ recursive }) : handle);
  return (recursive === true) ? fileSystemHandles.flat(Infinity) : fileSystemHandles;
}