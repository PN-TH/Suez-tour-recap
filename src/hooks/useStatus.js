import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
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

// export const useAnomalyStatus = isAnomaly => {
//   return isAnomaly ? 'close-outline' : 'checkmark-outline';
// };

export const useAnomlyStatus = (isState) => {
  return isState ? <CloseIcon /> : <></>;
};
