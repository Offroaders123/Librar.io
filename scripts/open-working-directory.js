// This function will open a FileSystemDirectoryHandle object that you pass into it as the app Working Directory.
// If a handle is not passed in, it will first use the handle stored in IndexedDB if one exists. If not, it will prompt the user to open one, and save that result to IndexedDB for later use.
// It will return an object that represents the folder structure for the resulting Working Directory folder.
import { WORKING_DIRECTORY } from "./constants.js";
import IDB from "./idb-keyval.js";
import verifyFileSystemHandlePermission from "./verify-handle-permission.js";
import getDirectoryTreeFromDirectory from "./tree-from-directory.js";

export default async function openWorkingDirectory(fileSystemDirectoryHandle){
  try {
    if (fileSystemDirectoryHandle) await IDB.set(WORKING_DIRECTORY,fileSystemDirectoryHandle);
    let directoryHandle = (!fileSystemDirectoryHandle) ? await IDB.get(WORKING_DIRECTORY) : fileSystemDirectoryHandle;
    if (!directoryHandle){
      directoryHandle = await window.showDirectoryPicker({ startIn: "music" });
      await IDB.set(WORKING_DIRECTORY,directoryHandle);
      console.log(`Stored FileSystemDirectoryHandle for "${directoryHandle.name}" in IndexedDB.`);
    } else {
      if (!(await verifyFileSystemHandlePermission(directoryHandle))) return;
      console.log(`Retrieved FileSystemDirectoryHandle "${directoryHandle.name}" from IndexedDB.`);
    }
    const directoryTree = await getDirectoryTreeFromDirectory(directoryHandle);
    // console.log(JSON.stringify(directoryTree,null,2));
    console.log(directoryTree);
    return directoryTree;
  } catch (error){
    console.error(error);
  }
}