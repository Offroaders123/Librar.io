class DirectoryItemsArray {
  constructor(FileSystemDirectoryHandle){
    return (async () => {
      try {
        const array = [];
        for await (const entry of FileSystemDirectoryHandle.values()) array.push(entry);
        return array;
      } catch (error){
        console.error(error);
      }
    })();
  }
}
export default DirectoryItemsArray;