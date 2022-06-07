import fsa from "./fsa.js";

document.addEventListener("dragover",event => event.preventDefault());

document.addEventListener("drop",async event => {
  event.preventDefault();
  const handles = await fsa.dataTransferHandles(event.dataTransfer);

  if (!handles.length) return;
  const directory = handles.filter(handle => handle.kind === "directory")[0];
  const tree = await fsa.dirtree(directory);
  console.log(tree);
  createTree({ tree });
});

const opener = document.querySelector("#opener");
opener.addEventListener("click",() => {
  createTree({ tree: library });
});

const main = document.querySelector("main");
const player = document.querySelector("#player");
const title = document.querySelector("#title");

const library = await (await fetch("scripts/library.json")).json();

createTree({ tree: library });

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
      opener.textContent = name;
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

  const blob = window.URL.createObjectURL(file);
  player.src = blob;
  title.textContent = name;
  player.paused ? player.play() : player.pause();
}