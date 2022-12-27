const { jsmediatags } = window;

/**
 * @typedef { import("jsmediatags/types").ShortcutTags & MediaMetadataInit } Tags
*/

/**
 * Reads the media tags from a given Blob object.
 * 
 * @param { Blob } file
 * @param { { artwork?: boolean; } | undefined } options
 * @returns { Promise<Tags> }
*/
export async function read(file,{ artwork = false } = {}){
  return new Promise((resolve,reject) => {
    jsmediatags.read(file,{
      onSuccess: ({ tags }) => {
        const shortcuts = ["title","artist","album","year","comment","track","genre","picture","lyrics"];
        for (const tag in tags){
          if (!shortcuts.includes(tag)) delete tags[tag];
        }
        // @ts-ignore
        const result = /** @type { Tags } */ (tags);
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