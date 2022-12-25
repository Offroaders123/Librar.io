import fsa from "./fsa.js";
import MediaTags from "./MediaTags.js";

document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const handles = await fsa.dataTransferHandles(/** @type { DataTransfer } */ (event.dataTransfer));

  if (!handles.length) return;
  const directories = /** @type { FileSystemDirectoryHandle[] } */ (handles.filter(handle => handle.kind === "directory"));
  const tree = await fsa.dirtree(directories);
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

// const library = await (await fetch(new URL("../test/library.json",import.meta.url))).json();

// createTree({ tree: library });

/**
 * @param { { tree: import("./fsa.js").DirTree[]; parent?: HTMLElement; } } options
*/
function createTree({ tree, parent = main }){
  if (parent === main){
    main.innerHTML = "";
  }

  for (const entry of tree){
    const { name, value } = entry;

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const content = document.createElement("section");
    const opener = document.createElement("button");

    if (value){
      // details.open = true;
      summary.textContent = name;
      createTree({ tree: value, parent: content });
      details.append(summary,content);
      parent.append(details);
    } else {
      opener.textContent = formatSong(name);
      opener.addEventListener("click",() => playSong(/** @type { FileSystemFileHandle } */ (entry.handle)));
      content.append(opener);
      parent.append(content);
    }
  }
}

/**
 * @param { FileSystemFileHandle } fileHandle
*/
async function playSong(fileHandle){
  if (fileHandle instanceof FileSystemFileHandle !== true) return;
  const file = await fileHandle.getFile();
  const { name, type } = file;
  if (!type.includes("audio")) return;

  const song = window.URL.createObjectURL(file);
  player.src = song;
  title.textContent = formatSong(name);
  await player.play();

  const tags = await MediaTags.read(file,{ artwork: true });

  if ("mediaSession" in navigator){
    navigator.mediaSession.metadata = new MediaMetadata(tags);
  }
  if (!tags.artwork) return art.src = "";

  art.src = tags.artwork[0].src;
}

/**
 * @param { string } name
*/
function formatSong(name){
  return name.split(" ").slice(1).join(" ").split(".").slice(0,-1).join(".");
}