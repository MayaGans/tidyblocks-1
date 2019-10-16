import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ChooseLanguage from "./chooseCodeLanguage"

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Job</th>
      </tr>
    </thead>
  )
}

const TableBody = props => {
  const rows = props.dataFrame.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.name}</td>
        <td>{row.job}</td>
      </tr>
    )
  })

  return <tbody>{rows}</tbody>
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8"
  }
})(Tabs);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4)
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  padding: {
    padding: theme.spacing(0.5)
  },
  demo2: {
    backgroundColor: "white"
  },
  fab: {
    position: "absolute",
    zIndex: 50
  }
}));

export default function ScrollableTabsButtonAuto({code, dataFrame, plot, error}) {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange}>
          <StyledTab label="Data" {...a11yProps(0)} />
          <StyledTab label="Plot" {...a11yProps(1)} />
          <StyledTab label="Debug" {...a11yProps(2)} />
          <StyledTab label="Text" {...a11yProps(3)} />
        </StyledTabs>
      </div>
      <TabPanel value={value} index={0}>
      <table>
        <TableHeader />
        <TableBody dataFrame={dataFrame} />
      </table>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {plot}
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div><pre>{error}</pre></div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ChooseLanguage />
      <div><pre>{code}</pre></div>
      </TabPanel>
    </div>
  );
}