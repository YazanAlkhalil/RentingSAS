import { Pipe, PipeTransform } from "@angular/core";
import { MultiLangs } from "../models/Interfaces/MultiLang";

@Pipe({
  name: "isColMultiLang",
  standalone: true,
})
export class IsColMultiLangPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if (!value) {
      return "-";
    }
    if (typeof value === "object") {
      const obj: MultiLangs = value;
      if (args[0].includes("Arabic")) return ` ${obj.ar}`;
      if (args[0].includes("English")) return ` ${obj.en}`;
      if (value["id"]) {
        console.log(value.get("username"));
        return value.get("username");
      }
    }
    return value;
  }
}
