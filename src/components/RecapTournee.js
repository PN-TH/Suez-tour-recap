/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { useEffect, useState } from "react";
import { withStyles, createStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Container } from "@material-ui/core";
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
  useQualityExportStatus,
  useFillingRateExportStatus,
} from "../hooks/useStatus";
import Autocomplete from "@mui/material/Autocomplete";
import { CSVLink } from "react-csv";
import ReactExport from "react-export-excel";

const StyledTableCell = withStyles((theme) =>
  createStyles({
    head: {
      backgroundColor: "#2184db",
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
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const classes = useStyles();
  const [IDs, setIDs] = useState([]);
  const [tourneeId, setTourneeId] = useState("");
  const [detection, setDetection] = useState([]);
  const [team, setTeam] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [csvDetection, setCsvDetection] = useState([]);
  const [csvInfo, setCsvInfo] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const headers = [
    { label: "DATE ET HEURE", key: "date" },
    { label: "Type de TAG", key: "typeTag" },
    { label: "SOURCE DE DONNEES", key: "sourceDonnees" },
    { label: "SITE 1", key: "site2" },
    { label: "SITE 2", key: "site1" },
    { label: "CLIENT", key: "client" },
    { label: "PROVENANCE", key: "provenance" },
    { label: "BATIMENT", key: "batiment" },
    { label: "PRODUCTEUR", key: "producteur" },
    { label: "NOM DU DECHET", key: "nomDechet" },
    { label: "CATEGORIE DE DECHET", key: "categorieDechet" },
    { label: "TYPE DE CONTENANT", key: "typeContenant" },
    { label: "VOLUME DE CONTENANT", key: "volumeContenant" },
    { label: "TOURNEE", key: "tournee" },
    { label: "QUALITE DE TRI", key: "qualiteTri" },
    { label: "TAUX DE REMPLISSAGE", key: "tauxRemplissage" },
    { label: "ANOMALIE", key: "anomaly" },
    { label: "LATITUDE", key: "latitude" },
    { label: "LONGITUDE", key: "longitude" },
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
      .then((res) => {
        setIDs(res.data);
      });
  };

  const transformID = (data) => {
    if (data.equipe) {
      const date = new Date(data.debut).toLocaleDateString().split(",");
      const hours = new Date(data.debut).toLocaleTimeString();
      const weight = data.poids ? data.poids : "";

      const result = `${date}_${hours}${weight && "_"}${weight}${
        weight && "kg"
      }`;
      return result;
    }
  };

  const getTournee = (id) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/airbus/getTourneeInfos?tourneeId=${
          id ? id : ""
        }`,
        {
          headers: { appname: "webapp" },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data[0].fin === null && data.debut !== null) {
          setInProgress(true);
        } else {
          setInProgress(false);
        }
        setError(false);
        setDetection(res.data[0].detections);
        setTeam(res.data[0].equipe);
        setData(res.data[0]);
        console.log(res.data[0]);
        let info = [];
        for (let item of res.data[0].detections) {
          info.push({
            date: new Date(item.samples[0]["date"])
              .toLocaleString()
              .split(",")
              .join(""),
            tagContenant: item["DAG RFID"],
            typeTag: item["Type de TAG"],
            sourceDonnees: item["Source de donnée"],
            site1: item["Site 1"],
            site2: item["Site 2"],
            client: item["Client"],
            provenance: item["Provenance"],
            batiment: item["Bâtiment"],
            producteur: item["Producteur"],
            nomDechet: item["Type de déchets"],
            categorieDechet: item["Catégorie de déchets"],
            typeContenant: item["Contenant"],
            volumeContenant: item["Volume Contenant"],
            tournee: item["Tournée"],
            qualiteTri: useQualityExportStatus(
              parseInt(item.samples[0]["quality"])
            ),
            tauxRemplissage: useFillingRateExportStatus(
              parseInt(item.samples[0]["filling"])
            ),
            anomaly: item.samples[0]["anomaly"],
            latitude: item.samples[0]["latitude"],
            longitude: item.samples[0]["longitude"],
          });
        }

        setCsvInfo((csvInfo) => info);
        setCsvDetection((csvDetection) => info);
      })

      .catch((err) => {
        setError(true);
        console.log(err);
        console.log(error);
      });
  };

  useEffect(() => {
    getIDTours();
    setError(false);
    getTournee(tourneeId ? tourneeId : "");
  }, [tourneeId]);

  return (
    <Container>
      <div>
        {data.detections && data.fin !== null ? (
          <h3>
            Tournée: <i style={{ fontSize: 16 }}>{transformID(data)}</i>
          </h3>
        ) : (
          <h3>
            Tournée: <i style={{ fontSize: 16 }}>En cours...</i>
          </h3>
        )}
        {!inProgress && <h4>Nombre de bacs: {detection.length}</h4>}

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
          </div>
        ))}
        <div className={classes.displayInfo}>
          <p>
            <strong>Date de début: </strong>
            {new Date(data.debut).toLocaleString()}
          </p>
          {data.fin !== null && (
            <p>
              <strong>Date de fin:</strong>{" "}
              {new Date(data.fin).toLocaleString()}
            </p>
          )}
        </div>
        <div className={classes.displayInfo}>
          {data.poids !== null && (
            <p>
              <strong>Poids:</strong> {data.poids} kg{" "}
            </p>
          )}

          {data.fin !== null && (
            <p>
              <strong>Durée: </strong>
              {calculateDuration(data.debut, data.fin)}
            </p>
          )}
        </div>
        <div className={classes.inputContainer}>
          <Autocomplete
            disablePortal
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(e, newVal) => {
              if (newVal) {
                getTournee(newVal._id);
                setTourneeId(newVal._id);
              } else {
                setTourneeId(null);
              }
            }}
            options={IDs}
            getOptionLabel={(option) =>
              new Date(option.debut).toLocaleString() + " " + option._id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="ID tournée"
                className={classes.input}
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
              />
            )}
          />
        </div>
      </div>
      <div>
        <CSVLink
          data={csvDetection}
          headers={headers}
          filename={`${transformID(data)}.csv`}
        >
          <Button
            style={{
              textDecoration: "none",
              backgroundColor: "#2184db",
              marginTop: 20,
              marginBottom: 20,
              marginRight: 10,
              color: "white",
            }}
            color="primary"
          >
            Exporter au format CSV
          </Button>
        </CSVLink>
        <ExcelFile
          filename={`${transformID(data)}`}
          element={
            <Button
              style={{
                textDecoration: "none",
                backgroundColor: "#2184db",
                marginTop: 20,
                marginBottom: 20,
                color: "white",
                marginLeft: 10,
              }}
              color="primary"
            >
              Exporter au format XLSX
            </Button>
          }
        >
          <ExcelSheet data={csvInfo} name="DETECTION">
            <ExcelColumn label="DATE ET HEURE" value="date" />
            <ExcelColumn label="TAG CONTENANT" value="tagContenant" />
            <ExcelColumn label="TYPE DE TAG" value="typeTag" />
            <ExcelColumn label="SOURCE DE DONNEES" value="sourceDonnees" />
            <ExcelColumn label="SITE 1" value="site1" />
            <ExcelColumn label="SITE 2" value="site2" />
            <ExcelColumn label="CLIENT" value="client" />
            <ExcelColumn label="PROVENANCE" value="provenance" />
            <ExcelColumn label="BATIMENT" value="batiment" />
            <ExcelColumn label="PRODUCTEUR" value="producteur" />
            <ExcelColumn label="NOM DU DECHET" value="nomDechet" />
            <ExcelColumn label="CATEGORIE DE DECHET" value="categorieDechet" />
            <ExcelColumn label="TYPE DE CONTENANT" value="typeContenant" />
            <ExcelColumn label="VOLUME DE CONTENANT" value="volumeContenant" />
            <ExcelColumn label="TOURNEE" value="tournee" />
            <ExcelColumn label="QUALITE DE TRI" value="qualiteTri" />
            <ExcelColumn label="TAUX DE REMPLISSAGE" value="tauxRemplissage" />
            <ExcelColumn label="ANOMALIE" value="anomaly" />
            <ExcelColumn label="LATITUDE" value="latitude" />
            <ExcelColumn label="LONGITUDE" value="longitude" />
          </ExcelSheet>
          <ExcelSheet data={csvDetection} name="TOURNEE">
            <ExcelColumn label="ID DAG" value="sensorid" />
            <ExcelColumn label="Type DAG" value="sensorType" />
            <ExcelColumn label="latitude" value="latitude" />
            <ExcelColumn label="longitude" value="longitude" />
            <ExcelColumn label="Qualité" value="quality" />
            <ExcelColumn label="Remplissage" value="filling" />
            <ExcelColumn label="Anomalie" value="anomaly" />
            <ExcelColumn label="Date" value="date" />
          </ExcelSheet>
        </ExcelFile>
        <TableContainer component={Paper} style={{ marginBottom: 100 }}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">ID DAG</StyledTableCell>
                <StyledTableCell align="left">Type DAG</StyledTableCell>
                <StyledTableCell align="left">Latitude</StyledTableCell>
                <StyledTableCell align="left">Longitude</StyledTableCell>
                <StyledTableCell align="left">Qualité</StyledTableCell>
                <StyledTableCell align="left">Remplissage</StyledTableCell>
                <StyledTableCell align="left">Anomalie</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detection.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row">
                    {row.sensorid}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.sensorType}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.samples[0].latitude}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.samples[0].longitude}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useQualityStatus(parseInt(row.samples[0].quality))}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useFillingRateStatus(parseInt(row.samples[0].filling))}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {useAnomlyStatus(parseInt(row.samples[0].anomaly))}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {new Date(row.samples[0].date).toLocaleString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {!detection.length === 0 && !inProgress && (
        <p style={{ display: "flex", justifyContent: "center" }}>
          Aucune data pour cette tournée
        </p>
      )}
      {inProgress && (
        <p style={{ display: "flex", justifyContent: "center" }}>
          Une tournée est actuellement en cours...
        </p>
      )}
    </Container>
  );
}
