// This function will return an array of FileSystemHandle objects from the DataTransfer.items object that you pass into it.
export default async function getFileSystemHandlesFromDataTransfer(dataTransferItems){
  const dataTransferFiles = Array.from(dataTransferItems).filter(item => item.kind === "file");
  const fileSystemHandles = (await Promise.all(dataTransferFiles.map(item => item.getAsFileSystemHandle()))).filter(item => item !== undefined);
  return fileSystemHandles;
}