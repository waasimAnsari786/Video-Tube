import fs from "fs";
// utility function for deleting files from local server
const deleteFileFromLocalServer = localFilePath => {
  if (fs.existsSync(localFilePath)) {
    // Delete file from local server
    fs.unlinkSync(localFilePath);
  }
};
export default deleteFileFromLocalServer;
