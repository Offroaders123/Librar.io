import { get, set } from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";

try {
  const fileHandleOrUndefined = await get("file");
  if (fileHandleOrUndefined){
    console.log(`Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`);
    window.file = fileHandleOrUndefined;
    console.log(window.file);
  }
} catch (error){
  alert(error.name,error.message);
}

const button = document.querySelector("button");
button.addEventListener("click",async () => {
  //try {
    const fileHandleOrUndefined = await get("file");
    if (fileHandleOrUndefined){
      if (!(await verifyPermission(fileHandleOrUndefined))) return;
      const values = await toArray(fileHandleOrUndefined.values());
      console.log(values);
      return;
    }
    // This always returns an array, but we just need the first entry.
    const fileHandle = await window.showDirectoryPicker();
    await set("file",fileHandle);
    console.log(`Stored file handle for "${fileHandle.name}" in IndexedDB.`);
    window.file = fileHandle;
    console.log(window.file);
  //} catch (error){
  //  alert(error.name,error.message);
  //}
});

window.toArray = toArray;
async function toArray(iterator){
  const array = [];
  for await (const i of iterator) array.push(i);
  return array;
}

window.verifyPermission = verifyPermission;
async function verifyPermission(fileHandle,options = {}){
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') return true;

  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') return true;

  // The user didn't grant permission, so return false.
  return false;
}