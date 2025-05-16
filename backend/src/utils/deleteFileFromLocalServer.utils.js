import fs from "fs";

//  Deletes all uploaded files (single/multiple) from the local server.

const deleteFileFromLocalServer = files => {
  if (Array.isArray(files)) {
    for (const file of files) {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
};

export default deleteFileFromLocalServer;
