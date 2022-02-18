// ES Module imports
import jsMediaTags from "./jsMediaTags.js";
import openWorkingDirectory from "./openWorkingDirectory.js";
import getFileSystemHandlesFromDataTransfer from "./getFileSystemHandlesFromDataTransfer.js";

// Adding access to module functions in the main scope (mostly just for debugging).
/* jsMediaTags is already in the global scope because of my ES Module workaround, so no need to add it again here for debugging purposes. */
window.openWorkingDirectory = openWorkingDirectory;
window.getFileSystemHandlesFromDataTransfer = getFileSystemHandlesFromDataTransfer;

// Override the default drag and drop behavior, and allow for the user to open their Working Directory by dragging it on to the app.
document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const fileSystemHandles = await getFileSystemHandlesFromDataTransfer(event.dataTransfer.items);
  const directoryHandle = fileSystemHandles.filter(handle => handle.kind === "directory")[0];
  openWorkingDirectory(directoryHandle);
});

// Open the Working Directory stored in IndexedDB, if one was previously stored. Otherwise, prompt the user to open a new Working Directory with the app.
const directory_opener = document.querySelector("#directory_opener");
directory_opener.addEventListener("click",async () => {
  openWorkingDirectory();
});