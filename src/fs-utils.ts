export async function getNewFileHandle() {
  if ("showSaveFilePicker" in window) {
    const options = {
      types: [
        {
          description: "Text Files",
          accept: {
            "text/plain": [".txt"],
          },
        },
      ],
    };
    const handle = await window.showSaveFilePicker(options);
    return handle as FileSystemFileHandle;
  }
  throw new Error("This browser is not supported");
}

// fileHandle is an instance of FileSystemFileHandle..
export async function writeFile(
  fileHandle: FileSystemFileHandle,
  contents: any
) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}
