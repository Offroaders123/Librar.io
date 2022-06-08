import fsa from "./fsa.js";
import MediaTags from "./MediaTags.js";

document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const handles = await fsa.dataTransferHandles(event.dataTransfer);

  if (!handles.length) return;
  const directories = handles.filter(handle => handle.kind === "directory");
  const tree = await fsa.dirtree(directories);
  console.log(tree);
  createTree({ tree });
});

const opener = document.querySelector("#opener");
opener.addEventListener("click",() => {
  // createTree({ tree: library });
});

const main = document.querySelector("main");
const art = document.querySelector("#art");
const player = document.querySelector("#player");
const title = document.querySelector("#title");

// const library = await (await fetch("scripts/library.json")).json();

// createTree({ tree: library });

function createTree({ tree, parent = main } = {}){
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
      opener.addEventListener("click",() => playSong(entry.handle));
      content.append(opener);
      parent.append(content);
    }
  }
}

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

  art.addEventListener("load",() => window.URL.revokeObjectURL(art.src),{ once: true });
  art.src = tags.artwork[0].src;
}

function formatSong(name){
  return name.split(" ").slice(1).join(" ").split(".").slice(0,-1).join(".");
}