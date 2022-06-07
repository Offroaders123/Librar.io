const { jsmediatags: MediaTags } = window;
delete window.jsmediatags;

const { Reader } = MediaTags;

export function read(file,{ art = false, advanced = false } = {}){
  return new Promise((resolve,reject) => {
    new Reader(file).read({
      onSuccess: result => {
        if (advanced) resolve(result);
        const { tags } = result;
        const shortcuts = ["title","artist","album","year","comment","track","genre","picture","lyrics"];
        for (const tag in tags){
          if (!shortcuts.includes(tag)) delete tags[tag];
        }
        if (art && tags.picture){
          const { format: type, data } = tags.picture;
          const blob = new Blob([new Uint8Array(data)],{ type });
          tags.art = blob;
        }
        delete tags.picture;
        resolve(tags);
      },
      onError: error => reject(error)
    });
  });
}

export default { read, [Symbol.toStringTag]: "MediaTags" };