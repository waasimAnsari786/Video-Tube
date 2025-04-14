/*This class has created for storing details of uploaded file, in a structured way so that it can be 
use for saving it in file fields in databse. Because i'm using a nmini schema for saving details of 
uploaded file in DB. Check out user or video model for better understanding */
class FileDetails {
  constructor(secureURL, resourceType, publicId) {
    this.secureURL = secureURL;
    this.resourceType = resourceType;
    this.publicId = publicId;
  }
}

export default FileDetails;
