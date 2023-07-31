import * as fs from "./fs.js";
import * as jsmediatags from "./jsmediatags.js";

document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const handles = await fs.dataTransferHandles(/** @type { DataTransfer } */ (event.dataTransfer));

  if (!handles.length) return;
  const directories = /** @type { FileSystemDirectoryHandle[] } */ (handles.filter(handle => handle.kind === "directory"));
  const tree = await fs.dirtree(directories);
  console.log(tree);
  createTree({ tree });
});

const opener = /** @type { HTMLButtonElement } */ (document.querySelector("#opener"));
opener.addEventListener("click",() => {
  // createTree({ tree: library });
});

const main = /** @type { HTMLElement } */ (document.querySelector("main"));
const art = /** @type { HTMLImageElement } */ (document.querySelector("#art"));
const player = /** @type { HTMLAudioElement } */ (document.querySelector("#player"));
const title = /** @type { HTMLElement } */ (document.querySelector("#title"));

const library = await (await fetch(new URL("../test/library.json",import.meta.url))).json();

createTree({ tree: library });

/**
 * Creates a DOM tree that mirrors the content of the given DirTree object.
 * 
 * @param { { tree: fs.DirTree[]; parent?: HTMLElement; } } options
*/
function createTree({ tree, parent = main }){
  if (parent === main){
    main.innerHTML = "";
  }

  console.log(tree);
  for (const entry of tree){
    const { name, value } = entry;

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const content = document.createElement("section");
    const opener = document.createElement("button");

    if (!(value instanceof FileSystemFileHandle) && Array.isArray(value)){
      // details.open = true;
      summary.textContent = name;
      createTree({ tree: value, parent: content });
      details.append(summary,content);
      parent.append(details);
    } else {
      // opener.textContent = formatSong(name);
      opener.textContent = name;

      opener.addEventListener("click",() => playSong(value));
      content.append(opener);
      parent.append(content);
    }
  }
}

/**
 * Plays a song from a given FileSystemFileHandle object.
 * 
 * @param { FileSystemFileHandle } fileHandle
*/
async function playSong(fileHandle){
  if (!(fileHandle instanceof FileSystemFileHandle)) return;

  const file = await fileHandle.getFile();
  const { name, type } = file;
  if (!type.includes("audio")) return;

  const song = URL.createObjectURL(file);
  player.src = song;
  title.textContent = formatSong(name);
  await player.play();

  const tags = await jsmediatags.read(file,{ artwork: true });

  navigator.mediaSession.metadata = new MediaMetadata(tags);

  if (tags.artwork !== undefined){
    art.src = tags.artwork[0].src;
  }
}

/**
 * Formats the FileSystemFileHandle name string to be only the song name portion.
 * 
 * @param { string } name
*/
function formatSong(name){
  return name.split(" ").slice(1).join(" ").split(".").slice(0,-1).join(".");
}