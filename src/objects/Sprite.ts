export default class Sprite {
  private _filePath: string;
  private _image: ImageBitmap | undefined;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  async load(): Promise<void> {
    const result = await fetch(this._filePath);
    const blob = await result.blob();
    this._image = await createImageBitmap(blob);
  }

  get image(): ImageBitmap | undefined {
    return this._image;
  }
}
