// This function will return a Promise, which will resolve to an object that holds the metadata about the audio file that you passed into the function. By default, only the shortcut metadata from JS MediaTags is returned.
import jsMediaTags from "./jsMediaTags.js";

export default async function getMediaTagsFromAudioFile(file,advanced = false){
  return new Promise((resolve,reject) => {
    new jsMediaTags.Reader(file).read({
      onSuccess: result => {
        if (result.tags.picture){
          const { format: type, data } = result.tags.picture;
          const blob = new Blob([new Uint8Array(data)],{ type });
          const link = window.URL.createObjectURL(blob);
          result.tags.picture = link;
        }
        if (advanced) resolve(result);
        const shortcuts = ["title","artist","album","year","comment","track","genre","picture","lyrics"];
        for (const tag in result.tags){
          if (!shortcuts.includes(tag)) delete result.tags[tag];
        }
        resolve(result.tags);
      },
      onError: error => reject(error)
    });
  });
}