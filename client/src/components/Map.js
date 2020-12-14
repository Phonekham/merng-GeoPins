import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import PinIcon from "./PinIcon";
import Context from "../context";
import Blog from "./Blog";
import { GET_PINS_QUERY } from "../graphql/queries";
import { useClient } from "../client";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 17.9994624,
  longitude: 102.6326528,
  zoom: 13,
};

const Map = ({ classes }) => {
  const client = useClient();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getUserPosition();
  }, []);
  useEffect(() => {
    getPins();
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude },
    });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        {...viewport}
        onClick={handleMapClick}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicGhvbmVraGFtIiwiYSI6ImNqeGlwZDNsdTBxamIzeG10OGg0YnRtZ3oifQ.6IMNjVL6bLc-AGGbNse2VA"
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
        {/* pin for the user's current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offetTop={-37}
          >
            <PinIcon size={30} color="red" />
          </Marker>
        )}
        {/* Draft pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offetTop={-37}
          >
            <PinIcon size={30} color="hotpink" />
          </Marker>
        )}
        {state.pins.map((pin) => (
          <Marker
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offetTop={-37}
          >
            <PinIcon size={30} color="darkblue" />
          </Marker>
        ))}
      </ReactMapGL>
      <Blog></Blog>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em",
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default withStyles(styles)(Map);
