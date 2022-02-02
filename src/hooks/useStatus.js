import CloseIcon from "@material-ui/icons/Close";
export const useQualityStatus = (num) => {
  switch (num) {
    case 1:
      /*       return { color: "#00b050", title: "C" }; */
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#00b050",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>C</p>
        </div>
      );
    case 2:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#ffc000",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>NC mineure</p>
        </div>
      );
    case 4:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#ff0000",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>NC majeure</p>
        </div>
      );
    // case 8:
    //   return { color: '#130059', title: 'Ano-', sub: 'malie' };
    default:
      return <></>;
  }
};

export const useFillingRateStatus = (num) => {
  switch (num) {
    case 1:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#00b050",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>25%</p>
        </div>
      );
    case 2:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#ffc000",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>50%</p>
        </div>
      );
    case 4:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#ff0000",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>100%</p>
        </div>
      );
    case 8:
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#130059",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          <p>120%</p>
        </div>
      );
    default:
      return <></>;
  }
};

export const useAnomlyStatus = (isState) => {
  return isState ? <CloseIcon /> : <></>;
};

export const useQualityExportStatus = (num) => {
  switch (num) {
    case 1:
      /*       return { color: "#00b050", title: "C" }; */
      return "CONFORME";
    case 2:
      return "NC MINEURE";
    case 4:
      return "NC MAJEURE";
    default:
      return "";
  }
};

export const useFillingRateExportStatus = (num) => {
  switch (num) {
    case 1:
      return "25 %";
    case 2:
      return "50 %";
    case 4:
      return "100 %";
    case 8:
      return "120 %";
    default:
      return "";
  }
};
