async function verifyPermission(FileSystemHandle,options = {}){
  if ((await FileSystemHandle.queryPermission(options)) === "granted") return true;
  if ((await FileSystemHandle.requestPermission(options)) === "granted") return true;
  return false;
}
export default verifyPermission;