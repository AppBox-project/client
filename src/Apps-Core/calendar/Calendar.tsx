import React from "react";
import { AppContextType } from "../../Utils/Types";
import { Grid } from "@material-ui/core";
import styles from "./styles.module.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const AppCal: React.FC<{ context: AppContextType }> = ({ context }) => {
  return (
    <context.UI.Animations.AnimationContainer>
      <Grid container>
        <Grid item xs={12} md={9}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card
              withBigMargin
              title="2020"
              className={styles.root}
            >
              <DnDCalendar
                defaultDate={moment().toDate()}
                defaultView="month"
                events={[
                  {
                    start: moment().toDate(),
                    end: moment().add(1, "days").toDate(),
                    title: "Some title",
                  },
                ]}
                localizer={localizer}
                onEventDrop={(data) => {
                  console.log(data);
                }}
                onEventResize={(data) => {
                  console.log(data);
                }}
                resizable
                style={{ height: "95%" }}
                selectable
              />
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={12} md={3}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin title="Calendars">
              Test
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppCal;
