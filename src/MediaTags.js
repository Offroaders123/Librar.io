const { jsmediatags: MediaTags } = window;

/**
 * @typedef { import("jsmediatags/types").ShortcutTags & MediaMetadataInit } MediaTags
*/

const { Reader } = MediaTags;

/**
 * @param { Blob } file
 * @param { { artwork?: boolean; } | undefined } options
 * @returns { Promise<MediaTags> }
*/
export async function read(file,{ artwork = false } = {}){
  return new Promise((resolve,reject) => {
    new Reader(file).read({
      onSuccess: ({ tags }) => {
        const shortcuts = ["title","artist","album","year","comment","track","genre","picture","lyrics"];
        for (const tag in tags){
          if (!shortcuts.includes(tag)) delete tags[tag];
        }
        // @ts-ignore
        const result = /** @type { MediaTags } */ (tags);
        if (artwork && result.picture){
          const { format: type, data } = result.picture;
          const blob = new Blob([new Uint8Array(data)],{ type });
          const src = window.URL.createObjectURL(blob);
          result.artwork = [{ src, type }];
        }
        delete result.picture;
        resolve(result);
      },
      onError: error => reject(error)
    });
  });
}

export default { read, [Symbol.toStringTag]: "MediaTags" };