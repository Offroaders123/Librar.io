// This function will return an object that represents the folder structure for the top-level FileSystemHandles that you pass into it.
import getMediaTagsFromAudioFile from "./getMediaTagsFromAudioFile.js";

export default async function getDirectoryTreeFromFileSystemHandles(fileSystemHandles){
  const results = await Promise.all(fileSystemHandles.map(async fileSystemHandle => {
    try {
      const file = await fileSystemHandle.getFile();
      if (!file.type.startsWith("audio/")) return console.warn(`Non-audio file discovered! Cannot be parsed with JS MediaTags: "${fileSystemHandle.name}"`,fileSystemHandle);
      const tags = await getMediaTagsFromAudioFile(file);
      const { title, artist, album, year, comment, track, genre, picture, lyrics } = tags;
      console.log(album);
      return album;
    } catch (error){
      console.error(error);
    }
  }));
  return sortArray(flattenArray(results));
}

function flattenArray(array){
  return Array.from(new Set(array)).filter(entry => typeof entry === "string");
}

function sortArray(array){
  return array.sort((left,right) => {
    left = formatKeyForSorting(left);
    right = formatKeyForSorting(right);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
}

function formatKeyForSorting(key){
  return key.toLowerCase().replace(/^(The|A)\s/i,"");
}