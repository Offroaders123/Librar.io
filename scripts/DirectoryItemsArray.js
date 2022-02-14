class DirectoryItemsArray {
  constructor(FileSystemDirectoryHandle){
    return (async () => {
      const array = [];
      for await (const entry of FileSystemDirectoryHandle.values()) array.push(entry);
      return array;
    })();
  }
}
export default DirectoryItemsArray;