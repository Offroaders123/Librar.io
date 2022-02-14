// ES Module imports
import idb from "./idb.js";
import verifyPermission from "./verifyPermission.js";
import DirectoryItemsArray from "./DirectoryItemsArray.js";

// Adding access to module functions in the main scope (mostly just for debugging)
window.idb = idb;
window.verifyPermission = verifyPermission;
window.DirectoryItemsArray = DirectoryItemsArray;

// Load any existing Directory Handles from IndexedDB on startup
try {
  const fileHandleOrUndefined = await idb.get("file");
  if (fileHandleOrUndefined){
    console.log(`Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`);
    window.file = fileHandleOrUndefined;
    console.log(window.file);
  }
} catch (error){
  alert(error.name,error.message);
}

// Open either the stored Directory Handle from IndexedDB if it exists, otherwise prompt the user to open a new Directory from their File System
const button = document.querySelector("button");
button.addEventListener("click",async () => {
  //try {
    const fileHandleOrUndefined = await idb.get("file");
    if (fileHandleOrUndefined){
      if (!(await verifyPermission(fileHandleOrUndefined))) return;
      const values = await new DirectoryItemsArray(fileHandleOrUndefined);
      console.log(values);
      return;
    }
    // This always returns an array, but we just need the first entry.
    const fileHandle = await window.showDirectoryPicker();
    await idb.set("file",fileHandle);
    console.log(`Stored file handle for "${fileHandle.name}" in IndexedDB.`);
    window.file = fileHandle;
    console.log(window.file);
  //} catch (error){
  //  alert(error.name,error.message);
  //}
});