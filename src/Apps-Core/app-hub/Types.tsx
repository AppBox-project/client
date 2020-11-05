import { ObjectType } from "../../Utils/Types";

export interface StoreAppType extends ObjectType {
  data: {
    key: string;
    name: string;
    banner: { url: string };
    description: string;
    repository: string;
    author: string;
    backend_repository: string;
    wizard: {
      intro: string;
      fields: {
        key: string;
        label: string;
        type: "options";
        options: { label: string; value: string }[];
        help: string;
      }[];
    };
    summary: string;
  };
}
