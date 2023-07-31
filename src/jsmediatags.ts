import type { ShortcutTags } from "jsmediatags/types";

const { jsmediatags } = window;

export type Tags = ShortcutTags & MediaMetadataInit;

export interface ReadOptions {
  artwork?: boolean;
}

/**
 * Reads the media tags from a given Blob object.
*/
export async function read(file: Blob, { artwork = false }: ReadOptions = {}): Promise<Tags> {
  return new Promise<Tags>((resolve,reject) => {
    jsmediatags.read(file,{
      onSuccess: ({ tags }) => {
        const shortcuts = ["title","artist","album","year","comment","track","genre","picture","lyrics"];
        for (const tag in tags){
          if (!shortcuts.includes(tag)) delete tags[tag];
        }
        const result = tags as Tags;
        if (artwork && result.picture){
          const { format: type, data } = result.picture;
          const blob = new Blob([new Uint8Array(data)],{ type });
          const src = URL.createObjectURL(blob);
          result.artwork = [{ src, type }];
        }
        delete result.picture;
        resolve(result);
      },
      onError: error => reject(error)
    });
  });
}