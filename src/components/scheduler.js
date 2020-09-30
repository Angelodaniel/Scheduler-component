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
      Resources,
      CurrentTimeIndicator,
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
      userModel,
      userFilter,
    } = options;
    const projectValue = useText(projectId);

    const [eventData, setEventDate] = useState([]);
    const [participantData, setParticipantData] = useState([]);

    const [resources, setResources] = useState([
      {
        fieldName: 'members',
        title: 'Members',
        instances: participantData,
        allowMultiple: true,
      },
    ]);

    const eventModelLoading = false;
    const userModelLoading = false;
    const userResponse = ({ loading, error, data, refetch } =
      model &&
      useGetAll(userModel, {
        filter: userFilter,
        skip: 0,
        take: 200,
      }));
    if (!userResponse.loading) {
      userModelLoading = true;
    }
    useEffect(() => {
      B.defineFunction('RefetchUsers', () => {
        userModelLoading = false;
        userResponse.refetch();
      });
    }, []);

    useEffect(() => {
      const { results = [], totalCount } = userResponse.data || {};
      const mappedResult = results.map(result => ({
        text: result.fullNameAndRole,
        id: result.id,
      }));
      setParticipantData(mappedResult);
    }, [userModelLoading]);

    useEffect(() => {
      setResources([
        {
          fieldName: 'members',
          title: 'Members',
          instances: participantData,
          allowMultiple: true,
        },
      ]);
    }, [participantData]);

    const { loading, error, data, refetch } =
      model &&
      useGetAll(model, {
        filter: filter,
        skip: 0,
        take: 200,
      });
    if (!loading) {
      eventModelLoading = true;
    }

    useEffect(() => {
      const { results = [], totalCount } = data || {};
      const mappedResult = results.map(result => ({
        title: result.title,
        startDate: result.startDate,
        endDate: result.endDate,
        members: JSON.parse(result.membersConcat),
        id: result.id,
        index: result.index,
      }));
      setEventDate(mappedResult);
    }, [eventModelLoading]);

    const commitChanges = ({ added, changed, deleted }) => {
      let data = eventData;
      if (added) {
        console.log(added);
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        let object = { id: startingAddedId, ...added };
        console.log(object);
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
            B.triggerEvent('onActionSuccess');
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
        console.log(changed);
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
                B.triggerEvent('onActionSuccess');
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
          B.triggerEvent('onActionSuccess');
          return response.json();
        });
        setEventDate(newdata);
      }
    };

    const SchedulerComponent = (
      <Paper>
        <Scheduler data={eventData}>
          <ViewState />
          {dayView && <DayView startDayHour={9} endDayHour={18} />}
          {weekView && (
            <WeekView
              name="work-week"
              displayName="Work Week"
              excludedDays={[0, 6]}
              startDayHour={9}
              endDayHour={19}
            />
          )}
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
          <Resources data={resources} mainResourceName="members" />
          <DragDropProvider />
          <CurrentTimeIndicator shadePreviousCells={true} />
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
      wrapper: {
        '& > *': {
          pointerEvents: 'none',
        },
      },
    };
  },
}))();
