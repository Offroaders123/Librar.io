import openWorkingDirectory from "./openWorkingDirectory.js";
import getFileSystemHandlesFromDataTransfer from "./handles-from-data-transfer.js";

// Override the default drag and drop behavior, and allow for the user to open their Working Directory by dragging it on to the app.
document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const fileSystemHandles = await getFileSystemHandlesFromDataTransfer(event.dataTransfer.items);
  if (fileSystemHandles.length !== 0){
    const [ directoryHandle ] = fileSystemHandles.filter(handle => handle.kind === "directory");
    openWorkingDirectory(directoryHandle);
  }
});

// Open the Working Directory stored in IndexedDB, if one was previously stored. Otherwise, prompt the user to open a new Working Directory with the app.
const directory_opener = document.querySelector("#directory_opener");
directory_opener.addEventListener("click",async () => {
  openWorkingDirectory();
});