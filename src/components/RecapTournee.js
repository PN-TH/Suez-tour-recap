/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import axios from "axios";
import { Container, Typography } from "@material-ui/core";
import {
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  useAnomlyStatus,
  useFillingRateStatus,
  useQualityStatus,
} from "../hooks/useStatus";
import Autocomplete from "@mui/material/Autocomplete";
import { CSVLink, CSVDownload } from "react-csv";

const StyledTableCell = withStyles((theme) =>
  createStyles({
    head: {
      backgroundColor: "#376FD0",
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  input: {
    width: 600,
    marginLeft: 40,
    paddingRight: 40,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  displayInfo: {
    display: "flex",
    justifyContent: "space-around",
    lineHeight: 0,
    padding: 0,
    margin: 0,
  },
});

export default function CustomizedTables() {
  const classes = useStyles();
  const [IDs, setIDs] = useState([]);
  const [tourneeId, setTourneeId] = useState("");
  const [detection, setDetection] = useState([]);
  const [team, setTeam] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [csvDetection, setCsvDetection] = useState([]);
  const a = [];

  const csvData = [
    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
  ];

  const pad = (d) => {
    return d < 10 ? "0" + d.toString() : d.toString();
  };
  const calculateDuration = (start, end) => {
    const time = (end - start) / 1000;
    let hours = parseInt(time / 3600); // get hours
    let minutes = parseInt((time - hours * 3600) / 60); // get minutes
    let seconds = time - hours * 3600 - minutes * 60; //  get seconds
    const timing = `${time < 0 ? "-" : ""}${Math.abs(hours)}:${pad(
      Math.abs(minutes)
    )}:${pad(Math.floor(Math.abs(seconds)))}`;
    return timing;
  };

  const getIDTours = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/airbus/getAllTournee`, {
        headers: { appname: "webapp" },
      })
      .then((res) => setIDs(res.data));
  };

  const transformID = (data) => {
    const date = new Date(data.debut).toLocaleDateString();
    const hours = new Date(data.debut).toLocaleTimeString();
    const weight = data.poids;
    const ripper = data.equipe && data.equipe[0].name.replace(/\s+/g, "");
    const driver = data.equipe && data.equipe[1].name.replace(/\s+/g, "");
    /*     console.log(data.detections[0].idDocument); */
    /* const type = data.detections[0].idDocument.samples[0].sensorType; */
    const result = `${date}_${hours}_${weight}kg_${driver}_${ripper}`;
    return result;
  };

  const getTournee = (id) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/airbus/getTourneeInfos?tourneeId=${id}`,
        {
          headers: { appname: "webapp" },
        }
      )
      .then((res) => {
        setError(false);
        setDetection(res.data[0].detections);
        setTeam(res.data[0].equipe);
        setData(res.data[0]);
        /*       console.log(res.data); */
        /*         const a = res.data[0].detections.forEach((el) => {
          return {
            sensorid: el.idDocument.sensorid,
            sensorType: el.idDocument.sensorType,
            latitude: el.idDocument.samples.latitude,
            longitude: el.idDocument.samples.longitude,
            quality: el.idDocument.samples.quality,
            filling: el.idDocument.samples.filling,
            anomaly: el.idDocument.samples.anomaly,
          };
        });
        setXlsxDetection(a); */
        let csv = [];
        for (let i = 0; i < res.data[0].detections.length; i++) {
          csv.push({
            sensorid: res.data[0].detections[i].idDocument.sensorid,
            sensorType: res.data[0].detections[i].idDocument.sensorType,
            latitude: res.data[0].detections[i].idDocument.samples.latitude,
            longitude: res.data[0].detections[i].idDocument.samples.longitude,
            quality: res.data[0].detections[i].idDocument.samples.quality,
            filling: res.data[0].detections[i].idDocument.samples.filling,
            anomaly: res.data[0].detections[i].idDocument.samples.anomaly,
            date: new Date(
              res.data[0].detections[i].idDocument.samples.date
            ).toLocaleString(),
          });
        }
        setCsvDetection((csvDetection) => csv);
      })

      .catch((err) => setError(true));
  };

  useEffect(() => {
    setError(false);
    getTournee(tourneeId);
    getIDTours();
  }, [tourneeId]);
  const xsls = () => {};

  return (
    <Container>
      <div>
        <h3>Tournée: {transformID(data)}</h3>
        <h3>Nombre de bacs: {detection.length}</h3>
        {team.map((el) => (
          <div key={el._id}>
            {el.role === "Chauffeur" && (
              <p>
                <strong>Chauffeur: </strong>
                {el.name}
              </p>
            )}
            {el.role === "Ripeur" && (
              <p>
                <strong>Ripeur: </strong>
                {el.name}
              </p>
            )}
            {/*             <p>aaaa</p>
            <p>bbbb</p> */}
          </div>
        ))}
        <div className={classes.displayInfo}>
          <p>
            <strong>Date de début: </strong>
            {new Date(data.debut).toLocaleString()}
          </p>
          <p>
            <strong>Date de fin:</strong> {new Date(data.fin).toLocaleString()}
          </p>
        </div>
        <div className={classes.displayInfo}>
          <p>
            <strong>Poids:</strong> {data.poids} kg{" "}
          </p>
          <p>
            <strong>Durée: </strong>
            {calculateDuration(data.debut, data.fin)}
          </p>
        </div>
        <div className={classes.inputContainer}>
          <Autocomplete
            disablePortal
            onChange={(e, newVal) => {
              setTourneeId(newVal);
              getTournee(newVal._id);
            }}
            options={IDs}
            getOptionLabel={(option) =>
              new Date(option.debut).toLocaleString() + " " + option._id
            }
            /*             renderOption={IDs.map((props, option) => (
              <div {...props}>{option.debut}</div>
            ))} */
            renderInput={(params) => (
              <TextField
                {...params}
                label="ID tournée"
                className={classes.input}
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                value={tourneeId}
              />
            )}
          />
        </div>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">sensorId</StyledTableCell>
                <StyledTableCell align="left">SensorType</StyledTableCell>
                <StyledTableCell align="left">Latitude</StyledTableCell>
                <StyledTableCell align="left">Longitude</StyledTableCell>
                <StyledTableCell align="left">Quality</StyledTableCell>
                <StyledTableCell align="left">Filling</StyledTableCell>
                <StyledTableCell align="left">Anomaly</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detection.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {row.idDocument.sensorid}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.idDocument.sensorType}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.idDocument.samples && row.idDocument.samples.latitude}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.idDocument.samples && row.idDocument.samples.longitude}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useQualityStatus(parseInt(row.idDocument.samples.quality))}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useFillingRateStatus(
                      parseInt(row.idDocument.samples.filling)
                    )}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useAnomlyStatus(parseInt(row.idDocument.samples.anomaly))}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {new Date(row.idDocument.samples.date).toLocaleString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {detection.length < 1 && !error ? (
        <p style={{ display: "flex", justifyContent: "center" }}>
          Aucune data pour cette tournée
        </p>
      ) : (
        ""
      )}
      <CSVLink data={csvDetection} filename={`${transformID(data)}.csv`}>
        Exporter au format CSV
      </CSVLink>
    </Container>
  );
}
