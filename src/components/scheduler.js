(() => ({
  name: 'Scheduler',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { Paper } = window.MaterialUI.Core;
    const { ViewState, EditingState, IntegratedEditing } = window.Scheduler;
    const {
      Scheduler,
      DayView,
      Appointments,
      Toolbar,
      MonthView,
      WeekView,
      ViewSwitcher,
      DateNavigator,
      DragDropProvider,
      TodayButton,
      AppointmentTooltip,
      AppointmentForm,
      ConfirmationDialog,
      AllDayPanel,
    } = window.MUIScheduler;
    const { useFilter, useGetAll, useText } = B;
    const isDev = B.env === 'dev';
    const {
      filter,
      model,
      toolbarVisibility,
      dayView,
      weekView,
      monthView,
      apiUrl,
      projectId,
    } = options;
    const projectValue = useText(projectId);

    const [eventData, setEventDate] = useState([]);
    let test = false;

    const { loading, error, data, refetch } =
      model &&
      useGetAll(model, {
        filter: filter,
        skip: 0,
        take: 200,
      });
    if (!loading) {
      test = true;
    }

    useEffect(() => {
      const { results = [], totalCount } = data || {};
      setEventDate(results);
    }, [test]);

    const commitChanges = ({ added, changed, deleted }) => {
      let data = eventData;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        let object = { id: startingAddedId, ...added };
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'Create',
            data: object,
            projectId: projectValue,
          }),
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            if (response.status === 200) {
              object = { index: response.id, ...object };
              data = [...data, object];
              setEventDate(data);
            }
          });
      }
      if (changed) {
        const newdata = data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment,
        );
        newdata.map(appointment =>
          changed[appointment.id]
            ? fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: 'Edit',
                  data: appointment,
                }),
              }).then(function(response) {
                return response.json();
              })
            : appointment,
        );
        setEventDate(newdata);
      }
      if (deleted !== undefined) {
        const newdata = data.filter(appointment => appointment.id !== deleted);
        const array = data.filter(appointment => appointment.id == deleted);
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'Delete',
            deletion_id: array[0].index,
          }),
        }).then(function(response) {
          return response.json();
        });
        setEventDate(newdata);
      }
    };

    const SchedulerComponent = (
      <Paper>
        <Scheduler data={eventData}>
          <ViewState />
          {dayView && <DayView startDayHour={9} endDayHour={17} />}
          {weekView && <WeekView startDayHour={9} endDayHour={17} />}
          {monthView && <MonthView />}
          {!dayView && !weekView && !monthView ? <DayView /> : null}

          {toolbarVisibility && <Toolbar />}
          {toolbarVisibility && <ViewSwitcher />}
          {toolbarVisibility && <DateNavigator />}
          {toolbarVisibility && <TodayButton />}

          <Appointments />
          <AllDayPanel />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <ConfirmationDialog />

          <AppointmentTooltip showCloseButton showOpenButton />
          <AppointmentForm />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    );

    return isDev ? (
      <span className={classes.wrapper}>{SchedulerComponent}</span>
    ) : (
      SchedulerComponent
    );
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    return {
      appointmentContainer: {
        backgroundColor: 'red',
      },
    };
  },
}))();
