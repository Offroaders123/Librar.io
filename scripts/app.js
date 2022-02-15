// ES Module imports
import idb from "./idb.js";
import MediaTags from "./MediaTags.js"; /* Temporary import fix located here to add ES Module support for JSMediaTags. MediaTags is already in the window because of my workaround, so no need to add it again below for debugging purposes. */
import verifyPermission from "./verifyPermission.js";
import DirectoryItemsArray from "./DirectoryItemsArray.js";

// Adding access to module functions in the main scope (mostly just for debugging).
window.idb = idb;
window.verifyPermission = verifyPermission;
window.DirectoryItemsArray = DirectoryItemsArray;

// On startup, load the existing Directory Handle from IndexedDB if one is present.
try {
  const fileHandleOrUndefined = await idb.get("file");
  if (fileHandleOrUndefined){
    console.log(`Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`);
    console.log(fileHandleOrUndefined);
  }
} catch (error){
  console.error(error);
}

// Open either the stored Directory Handle from IndexedDB if it exists, otherwise prompt the user to open a new Directory from their File System. **New feature edit: Also, open a tree view of that directory's items!
const directory_opener = document.querySelector("button");
directory_opener.addEventListener("click",async () => {
  try {
    const fileHandleOrUndefined = await idb.get("file");
    if (fileHandleOrUndefined){
      if (!(await verifyPermission(fileHandleOrUndefined))) return;
      const values = await new DirectoryItemsArray(fileHandleOrUndefined);
      console.log(values);
      openDirectory({ handle: fileHandleOrUndefined, drawTree: true, logOutput: true });
      return;
    }
    // This always returns an array, but we just need the first entry.
    const fileHandle = await window.showDirectoryPicker();
    await idb.set("file",fileHandle);
    console.log(`Stored file handle for "${fileHandle.name}" in IndexedDB.`);
    console.log(fileHandle);
    openDirectory({ handle: fileHandle, drawTree: true, logOutput: true });
  } catch (error){
    console.error(error);
  }
});

/* Legacy Code from "Directory Editor.html" follows! */
var activeSong = null;
document.body.addEventListener("dragover",event => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});
document.body.addEventListener("drop",async event => {
  event.preventDefault();
  Array.from(event.dataTransfer.items).forEach(async item => {
    if (item.kind != "file") return;
    var handle = await item.getAsFileSystemHandle();
    if (handle.kind != "directory") return;
    openDirectory({ handle, drawTree: true, logOutput: true });
  });
});
function createTree({ name = "Folder", tree, parent = tree_viewer } = {}){
  if (parent == tree_viewer){
    directory_title.textContent = name;
    song_title.textContent = "";
    song_player.src = "";
    tree_viewer.innerHTML = "";
  }
  if (Object.keys(tree).length == 0) return parent.textContent = "<empty>";
  Object.keys(tree).forEach(entryName => {
    var entry = tree[entryName];
    var kind = (typeof entry);

    var details = document.createElement("details");
    var summary = document.createElement("summary");
    var content = document.createElement("section");
    var opener = document.createElement("button");

    if (kind == "object" && entry.constructor.name != "FileSystemFileHandle"){
      //details.open = true;
      summary.textContent = entryName;
      createTree({ tree: entry, parent: content });
      details.appendChild(summary);
      details.appendChild(content);
      parent.appendChild(details);
    } else {
      opener.textContent = entryName;
      opener.addEventListener("click",async () => {
        playAudio({ handle: entry });
      });
      content.appendChild(opener);
      parent.appendChild(content);
    }

  });
}
async function playAudio({ handle } = {}){
  if (handle.constructor.name != "FileSystemFileHandle") return;
  var file = await handle.getFile();
  var type = file.type;
  if (!type.includes("audio")) return;
  if (handle != activeSong){
    activeSong = handle;
    var link = window.URL.createObjectURL(file);
    song_player.src = link;
    song_title.textContent = file.name;
  }
  (song_player.paused) ? song_player.play() : song_player.pause();
}
async function openDirectory({ handle, drawTree = false, logOutput = false } = {}){
  if (!handle) handle = await window.showDirectoryPicker().catch(error => {
    if (error.message.toLowerCase().includes("abort")) return;
  });
  if (!handle) return;
  var entries = {};
  for await (var entry of handle.values()) entries[entry.name] = entry;
  var listo = Object.keys(entries).sort((current,next) => {
    current = current.toLowerCase().replace(/^The\s/i,"");
    next = next.toLowerCase().replace(/^The\s/i,"");
    if (current < next) return -1;
    if (current > next) return 1;
    return 0;
  });
  var sorted = {};
  for await (var entryName of listo){
    var entry = entries[entryName];
    var kind = entry.kind;
    sorted[entryName] = (kind == "directory") ? await openDirectory({ handle: entry }) : entry;
  }
  if (drawTree) createTree({ name: entry.name, tree: sorted });
  if (logOutput) console.log(sorted);
  return sorted;
}