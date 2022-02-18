// This function will return the user permission state of the FileSystemHandle object that you pass into it.
// The user will be prompted about permission for Read and Write access (default options value) if the permission hasn't already been provided.
export default async function verifyFileSystemHandlePermission(fileSystemHandle,options = { readwrite: true }){
  if ((await fileSystemHandle.queryPermission(options)) === "granted") return true;
  if ((await fileSystemHandle.requestPermission(options)) === "granted") return true;
  return false;
}