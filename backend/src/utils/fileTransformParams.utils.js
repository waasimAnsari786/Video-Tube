class CloudinaryTransform {
  constructor(height, width) {
    if (!height || !width) {
      throw new Error(
        "Height and Width are required for image transformation."
      );
    }

    this.height = height;
    this.width = width;
    this.gravity = "auto";
    this.crop = "fill";
    this.quality = "auto";
    this.fetch_format = "auto";
  }
}

export default CloudinaryTransform;
