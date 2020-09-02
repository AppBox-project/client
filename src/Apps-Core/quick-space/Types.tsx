export interface AppProjectType {
  _id;
  data: {
    name: string;
    parent: string;
    owner: string;
    display_in: string;
    notes_type: "Default" | "Recipes" | "Code";
    todos_type: "Default" | "Groceries";
    Groceries;
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
    related_notes: string[];
    parent: string;
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
