import * as Core from '@material-ui/core';
import * as Lab from '@material-ui/lab';
import * as Pickers from '@material-ui/pickers';
import * as Styles from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import Icons from './icons';
import * as Scheduler from '@devexpress/dx-react-scheduler';
import * as MUIScheduler from '@devexpress/dx-react-scheduler-material-ui';

export default { Core, Icons, Lab, Pickers, Styles, DateFnsUtils };
window.Scheduler = Scheduler;
window.MUIScheduler = MUIScheduler;