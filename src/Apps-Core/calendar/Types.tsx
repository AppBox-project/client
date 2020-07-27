import { ColorType } from "../../Utils/Types";

export interface AppCalCalendarType {
  _id;
  data: {
    name: string;
    owner: string;
    color: ColorType;
  };
}

export interface AppCalEventType {
  _id;
  data: {
    name: string;
    calendar: string;
    from: string;
    until: string;
    allday: boolean;
    color: ColorType;
    description: string;
    recurring?: boolean;
    recurring_until?: string;
    recurring_frequency?:
      | "Secondly"
      | "Minutely"
      | "Hourly"
      | "Daily"
      | "Weekly"
      | "Monthly"
      | "Yearly";
    recurring_interval?: number;
    recurring_weekday?: number;
    recurring_month?: number;
  };
}
