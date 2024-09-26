import { File, Object } from "parse";

export class Image extends Object {
  constructor() {
    super("Image");
  }

  get image_thumb(): File {
    return super.get("image_thumb");
  }
  set image_thumb(value: File) {
    super.set("image_thumb", value);
  }
  get image(): File {
    return super.get("image");
  }
  set image(value: File) {
    super.set("image", value);
  }
  get loaderData(): string {
    return super.get("loaderData");
  }
  set loaderData(value: string) {
    super.set("loaderData", value);
  }
}
