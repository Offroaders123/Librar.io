// This function will open a FileSystemDirectoryHandle object that you pass into it as the app Working Directory.
// If a handle is not passed in, it will first use the handle stored in IndexedDB if one exists. If not, it will prompt the user to open one, and save that result to IndexedDB for later use.
// It will return an object that represents the folder structure for the resulting Working Directory folder.
import { WORKING_DIRECTORY } from "./constants.js";
import idb from "./idb.js";
import verifyFileSystemHandlePermission from "./verifyFileSystemHandlePermission.js";
import getFileSystemHandlesFromDirectory from "./getFileSystemHandlesFromDirectory.js";
import getDirectoryTreeFromFileSystemHandles from "./getDirectoryTreeFromFileSystemHandles.js";

export default async function openWorkingDirectory(fileSystemDirectoryHandle){
  try {
    if (fileSystemDirectoryHandle) await idb.set(WORKING_DIRECTORY,fileSystemDirectoryHandle);
    let directoryHandle = (!fileSystemDirectoryHandle) ? await idb.get(WORKING_DIRECTORY) : fileSystemDirectoryHandle;
    if (!directoryHandle){
      directoryHandle = await window.showDirectoryPicker({ startIn: "music" });
      await idb.set(WORKING_DIRECTORY,directoryHandle);
      console.log(`Stored FileSystemDirectoryHandle for "${directoryHandle.name}" in IndexedDB.`);
    } else {
      if (!(await verifyFileSystemHandlePermission(directoryHandle))) return;
      console.log(`Retrieved FileSystemDirectoryHandle "${directoryHandle.name}" from IndexedDB.`);
    }
    const fileSystemHandles = await getFileSystemHandlesFromDirectory(directoryHandle,{ recursive: true });
    const directoryTree = await getDirectoryTreeFromFileSystemHandles(fileSystemHandles);
    console.log(directoryTree);
    return directoryTree;
  } catch (error){
    console.error(error);
  }
}