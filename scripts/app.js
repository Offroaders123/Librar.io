// ES Module imports
import idb from "./idb.js";
import MediaTags from "./MediaTags.js"; /* Temporary import fix located here to add ES Module support for JSMediaTags. MediaTags is already in the window because of my workaround, so no need to add it again below for debugging purposes. */
import verifyPermission from "./verifyPermission.js";
import DirectoryItemsArray from "./DirectoryItemsArray.js";

// Adding access to module functions in the main scope (mostly just for debugging).
window.idb = idb;
window.verifyPermission = verifyPermission;
window.DirectoryItemsArray = DirectoryItemsArray;

// Drag and Drop Handling on the Document
document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const directoryHandles = (await Promise.all(Array.from(event.dataTransfer.items).filter(item => item.kind === "file").map(item => item.getAsFileSystemHandle()))).filter(handle => handle.kind === "directory");
  console.log(directoryHandles);
});

const directory_opener = document.querySelector("#directory_opener");