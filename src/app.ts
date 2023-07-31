import * as fs from "./fs.js";
import * as jsmediatags from "./jsmediatags.js";

document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  const handles = await fs.dataTransferHandles(event.dataTransfer);
  if (!handles.length) return;

  const directories = handles.filter((handle): handle is FileSystemDirectoryHandle => handle.kind === "directory");
  const tree = await fs.dirtree(directories);
  console.log(tree);
  createTree({ tree });
});

const opener = document.querySelector<HTMLButtonElement>("#opener")!;
opener.addEventListener("click",() => {
  // createTree({ tree: library });
});

const main = document.querySelector<HTMLElement>("main")!;
const art = document.querySelector<HTMLImageElement>("#art")!;
const player = document.querySelector<HTMLAudioElement>("#player")!;
const title = document.querySelector<HTMLElement>("#title")!;

// const library = await (await fetch(new URL("../test/library.json",import.meta.url))).json();

// createTree({ tree: library });

interface CreateTreeOptions {
  tree: fs.DirTree[];
  parent?: HTMLElement;
}

/**
 * Creates a DOM tree that mirrors the content of the given DirTree object.
*/
function createTree({ tree, parent = main }: CreateTreeOptions): void {
  if (parent === main){
    main.innerHTML = "";
  }

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

      opener.addEventListener("click",() => {
        if (!(value instanceof FileSystemFileHandle)) return;
        playSong(value);
      });
      content.append(opener);
      parent.append(content);
    }
  }
}

/**
 * Plays a song from a given FileSystemFileHandle object.
*/
async function playSong(fileHandle: FileSystemFileHandle): Promise<void> {
  const file = await fileHandle.getFile();
  const { name, type } = file;
  if (!type.includes("audio")) return;

  const song = URL.createObjectURL(file);
  player.src = song;
  title.textContent = formatSong(name);
  await player.play();

  const tags = await jsmediatags.read(file,{ artwork: true });

  navigator.mediaSession.metadata = new MediaMetadata(tags);

  const artwork = tags.artwork?.[0];
  if (artwork === undefined) return;
  art.src = artwork.src;
}

/**
 * Formats the FileSystemFileHandle name string to be only the song name portion.
*/
function formatSong(name: string): string {
  return name.split(" ").slice(1).join(" ").split(".").slice(0,-1).join(".");
}