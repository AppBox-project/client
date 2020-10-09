import React, { useState, useEffect } from "react";
import { AppContextType, ModelType, PersonType } from "../../Utils/Types";
import {
  Grid,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Avatar,
  Button,
} from "@material-ui/core";
import styles from "./styles.module.scss";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AppCalCalendarType, AppCalEventType } from "./Types";
import { findIndex, find } from "lodash";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import parseISO from "date-fns/parseISO";
import RRule from "rrule";
import { BsCalendar, BsCalendarFill } from "react-icons/bs";
import { nl, enGB } from "date-fns/esm/locale";
import balloons from "./balloons.png";
import { useHistory, Link } from "react-router-dom";
import { FaMailBulk, FaPhone, FaPlus } from "react-icons/fa";

const locales = {
  nl,
  enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop(Calendar);

const AppCal: React.FC<{ context: AppContextType }> = ({ context }) => {
  // Vars
  const [calendars, setCalendars] = useState<AppCalCalendarType[]>([]);
  const [events, setEvents] = useState<
    {
      name: string;
      start: Date;
      end: Date;
      allday: boolean;
      isBirthday?: boolean;
      event: AppCalEventType;
      calendar: AppCalCalendarType;
      person: PersonType;
    }[]
  >([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [eventModel, setEventModel] = useState<ModelType>();
  const [defaultCalendar, setDefaultCalendar] = useState<any>();
  const history = useHistory();

  // Lifecycle
  // Main effect
  useEffect(() => {
    const calRequest = context.getObjects(
      "calendar-calendars",
      { "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          setCalendars(response.data);
          setDefaultCalendar(response.data[0]._id);
          const selectedCals = [];
          response.data.map((calendar) => {
            selectedCals.push(calendar._id);
          });
          setTimeout(() => {
            setSelectedCalendars(selectedCals); // Also select calendars by default on page load
          }, 100);
        } else {
          console.log(response);
        }
      }
    );

    const modelRequest = context.getModel("calendar-events", (response) => {
      if (response.success) {
        setEventModel(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      calRequest.stop();
      modelRequest.stop();
    };
  }, []);

  // Events effect
  useEffect(() => {
    const newEvents = [];
    let birthdayRequest;
    const eventsRequest = context.getObjects(
      "calendar-events",
      {
        "data.calendar": { $in: selectedCalendars },
      },
      (response) => {
        if (response.success) {
          response.data.map((event: AppCalEventType) => {
            if (event.data.recurring) {
              // Add all recurrant events
              let frequency = RRule.WEEKLY;
              switch (event.data.recurring_frequency) {
                case "Secondly":
                  frequency = RRule.WEEKLY;
                  break;
                case "Minutely":
                  frequency = RRule.MINUTELY;
                  break;
                case "Hourly":
                  frequency = RRule.HOURLY;
                  break;
                case "Daily":
                  frequency = RRule.DAILY;
                  break;
                case "Weekly":
                  frequency = RRule.WEEKLY;
                  break;
                case "Monthly":
                  frequency = RRule.MONTHLY;
                  break;
                case "Yearly":
                  frequency = RRule.YEARLY;
                  break;
                default:
                  frequency = RRule.WEEKLY;
                  break;
              }

              const rule = new RRule({
                freq: frequency,
                interval: event.data.recurring_interval || 1,
                ...(event.data.recurring_weekday
                  ? { byweekday: event.data.recurring_weekday }
                  : {}),
                dtstart: parseISO(event.data.from),
                until: event.data.recurring_until
                  ? parseISO(event.data.recurring_until)
                  : new Date(Date.UTC(2030, 12, 31, 0, 0, 0)),
              });

              rule.all().map((recEvent) => {
                newEvents.push({
                  name: event.data.name,
                  start: recEvent,
                  end: recEvent,
                  allday: event.data.allday,
                  event: event,
                  calendar: find(
                    calendars,
                    (o) => o._id === event.data.calendar
                  ),
                });
              });
            } else {
              newEvents.push({
                name: event.data.name,
                start: parseISO(event.data.from),
                end: parseISO(event.data.until),
                allday: event.data.allday,
                event: event,
                calendar: find(calendars, (o) => o._id === event.data.calendar),
              });
            }
          });

          birthdayRequest = context.getObjects("people", {}, (response) => {
            if (response.success) {
              response.data.map((person) => {
                if (person.data.birthday) {
                  const rule = new RRule({
                    freq: RRule.YEARLY,
                    interval: 1,
                    count: 50,
                    dtstart: parseISO(person.data.birthday),
                  });

                  rule.all().map((recEvent) => {
                    newEvents.push({
                      name: `Birthday of ${person.data.full_name}`,
                      start: recEvent,
                      end: recEvent,
                      isBirthday: true,
                      event: {
                        data: {
                          name: `Birthday of ${person.data.full_name}`,
                          description: context.formatString(
                            `${
                              person.data.gender === "Male"
                                ? "He turns"
                                : person.data.gender === "Female"
                                ? "She turns"
                                : "They turn"
                            } {{ differenceInYears("${recEvent}", birthday) }}!`,
                            person.data
                          ),
                          color: { r: 49, g: 134, b: 160 },
                        },
                      },
                      person,
                      allday: true,
                    });
                  });
                }
              });
              setEvents(newEvents);
            } else {
              console.log(response);
            }
          });
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      eventsRequest.stop();
      birthdayRequest.stop();
    };
  }, [selectedCalendars]);

  // UI
  return (
    <div style={{ paddingBottom: 64 }}>
      <context.UI.Animations.AnimationContainer>
        <Grid container>
          <Grid item xs={12} md={9}>
            <context.UI.Animations.AnimationItem>
              <context.UI.Design.Card withBigMargin className={styles.root}>
                <DnDCalendar
                  defaultView="month"
                  events={events}
                  localizer={localizer}
                  culture="nl"
                  onEventDrop={(data) => {
                    context.updateObject(
                      "calendar-events",
                      { from: data.start, until: data.end },
                      data.event?.event?._id
                    );
                  }}
                  onEventResize={(data) => {
                    context.updateObject(
                      "calendar-events",
                      { from: data.start, until: data.end },
                      data.event?.event?._id
                    );
                  }}
                  resizable
                  selectable
                  titleAccessor="name"
                  startAccessor="start"
                  endAccessor="end"
                  allDayAccessor="allday"
                  tooltipAccessor={(event) => event.event.data.description}
                  eventPropGetter={(event, start, end, isSelected) => {
                    return {
                      style: {
                        transition: "all 0.3s",
                        backgroundColor: event.event.data.color
                          ? `rgb(${event.event.data.color?.r},${event.event.data.color?.g},${event.event.data.color?.b})`
                          : `rgb(${event.calendar.data.color?.r},${event.calendar.data.color?.g},${event.calendar.data.color?.b})`,
                      },
                    };
                  }}
                  onSelectEvent={(event, e) => {
                    context.setDialog({
                      display: true,
                      title: event.name,
                      background: event.isBirthday && balloons,

                      size: event.isBirthday ? "sm" : "lg",
                      content: event.isBirthday ? (
                        <>
                          {context.formatString(
                            `{{first_name}} turns {{ differenceInYears("${event.start}", birthday) }} today!`,
                            event.person.data
                          )}
                          <Grid container spacing={2} style={{ width: "100%" }}>
                            <Grid item xs={12}>
                              <Button
                                onClick={() =>
                                  history.push(`/o/${event.person._id}`)
                                }
                                fullWidth
                                variant="contained"
                                style={{ marginTop: 10 }}
                                startIcon={
                                  <Avatar
                                    src={event.person.data.picture}
                                    style={{
                                      width: 18,
                                      height: 18,
                                    }}
                                  />
                                }
                              >
                                View {event.person.data.first_name}
                              </Button>
                            </Grid>
                            {event.person.data.email && (
                              <Grid item xs={6}>
                                <a href={`mailto:${event.person.data.email}`}>
                                  <Button
                                    fullWidth
                                    color="primary"
                                    startIcon={<FaMailBulk />}
                                    variant="contained"
                                  >
                                    Send mail
                                  </Button>
                                </a>
                              </Grid>
                            )}
                            {event.person.data.phone && (
                              <Grid item xs={6}>
                                <a href={`tel:${event.person.data.phone}`}>
                                  <Button
                                    fullWidth
                                    color="primary"
                                    startIcon={<FaPhone />}
                                    variant="contained"
                                  >
                                    Call
                                  </Button>
                                </a>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      ) : (
                        <context.UI.Object.Detail
                          model={eventModel}
                          context={context}
                          objectId={event.event._id}
                          popup
                          layoutId="popup"
                        />
                      ),
                    });
                  }}
                  onSelectSlot={(data) => {
                    if (data.action === "doubleClick") {
                      context.setDialog({
                        display: true,
                        title: "New event",
                        size: "lg",
                        content: (
                          <context.UI.Object.Detail
                            model={eventModel}
                            popup
                            context={context}
                            layoutId="popup"
                            defaults={{
                              //@ts-ignore
                              allday: true,
                              //@ts-ignore
                              from: data.start,
                              //@ts-ignore
                              until: data.end,
                              //@ts-ignore
                              calendar: defaultCalendar,
                            }}
                          />
                        ),
                      });
                    }
                  }}
                />
              </context.UI.Design.Card>
            </context.UI.Animations.AnimationItem>
          </Grid>
          <Grid item xs={12} md={3}>
            <context.UI.Animations.AnimationItem>
              <context.UI.Design.Card
                withBigMargin
                title="Calendars"
                buttons={[
                  {
                    icon: FaPlus,
                    onClick: () =>
                      context.setDialog({
                        display: true,
                        title: "New calendar",
                        content: (
                          <context.UI.Object.Detail
                            context={context}
                            modelId="calendar-calendars"
                            layoutId="create_app"
                            popup
                            defaults={{ owner: context.user._id }}
                            onSuccess={() =>
                              context.setDialog({ display: false })
                            }
                          />
                        ),
                      }),
                    label: "New calendar",
                    compact: true,
                  },
                ]}
              >
                <List>
                  {calendars.map((calendar) => (
                    <ListItem
                      key={calendar._id}
                      button
                      onClick={() => {
                        if (selectedCalendars.includes(calendar._id)) {
                          const newSelectedCalendars = selectedCalendars;
                          newSelectedCalendars.splice(
                            findIndex(
                              newSelectedCalendars,
                              (o) => o === calendar._id
                            ),
                            1
                          );
                          setSelectedCalendars([...newSelectedCalendars]);
                        } else {
                          setSelectedCalendars([
                            ...selectedCalendars,
                            calendar._id,
                          ]);
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          style={{
                            ...(selectedCalendars.includes(calendar._id)
                              ? {
                                  backgroundColor: `rgb(${calendar.data.color.r},${calendar.data.color.g},${calendar.data.color.b})`,
                                }
                              : {}),
                          }}
                        >
                          {selectedCalendars.includes(calendar._id) ? (
                            <BsCalendarFill style={{ width: 18, height: 18 }} />
                          ) : (
                            <BsCalendar style={{ width: 18, height: 18 }} />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText>{calendar.data.name}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </context.UI.Design.Card>
            </context.UI.Animations.AnimationItem>
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationContainer>
    </div>
  );
};

export default AppCal;
