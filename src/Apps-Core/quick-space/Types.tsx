import { ColorType } from "../../Utils/Types";

export interface AppProjectType {
  _id;
  data: {
    name: string;
    parent: string;
    owner: string;
    display_in: string;
    notes_type: "Default" | "Recipes" | "Code";
    todos_type: "Default" | "Groceries";
    note_tags_enabled?: boolean;
  };
}

export interface AppNoteType {
  _id;
  data: {
    title: string;
    note: string;
    image: string;
    owner: string;
    project: string;
  };
}

export interface AppTodoType {
  _id;
  data: {
    action: string;
    description: string;
    owner: string;
    project: string;
    done: boolean;
    tags: string[];
    notes: string;
    priority: "Very low" | "Low" | "Medium" | "High" | "Very high" | "Urgent";
    relatedNotes: string[];
    belongs_to: string;
    status:
      | "To-do"
      | "Up Next"
      | "Investigating"
      | "Outsourced"
      | "In Progress"
      | "Won't do";
    related_todos: string[];
    difficulty:
      | "Very easy"
      | "Easy"
      | "Normal"
      | "Slightly difficult"
      | "Difficult"
      | "Very difficult";
  };
}

export interface AppTagType {
  _id: string;
  data: {
    name: string;
    color: ColorType;
  };
}
