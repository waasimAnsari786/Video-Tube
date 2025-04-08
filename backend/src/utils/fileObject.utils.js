/*This class has created for storing uploaded file details in a structured way so that it can be 
use for saving it in "Video" collection's each created document's "video" and "thumbnail"
fields */
class FileDetails {
  constructor(secureURL, resourceType, publicId) {
    this.secureURL = secureURL;
    this.resourceType = resourceType;
    this.publicId = publicId;
  }
}

export default FileDetails;
