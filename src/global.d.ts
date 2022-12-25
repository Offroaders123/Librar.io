declare global {
  interface Window {
    jsmediatags: typeof import("jsmediatags");
  }

  interface RecursiveHandleArray extends Array<FileSystemHandle | RecursiveHandleArray> {}
}

export {};