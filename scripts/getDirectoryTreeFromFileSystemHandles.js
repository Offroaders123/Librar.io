// This function will return an object that represents the folder structure for the top-level FileSystemHandles that you pass into it.
import getFileSystemHandlesFromDirectory from "./getFileSystemHandlesFromDirectory.js";
import getMediaTagsFromAudioFile from "./getMediaTagsFromAudioFile.js";

export default async function getDirectoryTreeFromFileSystemHandles(fileSystemHandles){
  fileSystemHandles.forEach(async fileSystemHandle => {
    const kind = fileSystemHandle.kind;
    if (kind === "directory") return await getDirectoryTreeFromFileSystemHandles(await getFileSystemHandlesFromDirectory(fileSystemHandle));
    const file = await fileSystemHandle.getFile();
    const tags = await getMediaTagsFromAudioFile(file);

    /* For testing: this will open album art for the song into the document! */
    if (tags.picture){
      const img = new Image();
      img.src = tags.picture;
      document.body.appendChild(img);
    }
  });
}