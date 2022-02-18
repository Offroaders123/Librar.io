// This function will return the user permission state of the FileSystemHandle object that you pass into it.
// The user will be prompted about permission for read access (default options value) if the permission hasn't already been provided thus far.
export default async function verifyFileSystemHandlePermission(fileSystemHandle,options){
  if ((await fileSystemHandle.queryPermission(options)) === "granted") return true;
  if ((await fileSystemHandle.requestPermission(options)) === "granted") return true;
  return false;
}