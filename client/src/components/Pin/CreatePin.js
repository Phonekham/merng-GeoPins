import React, { useContext, useState } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from "../../context";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../client";

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { latitude, longitude } = state.draft;
      const url = await handleImageUpload();
      const variables = {
        title,
        image: url,
        content,
        latitude,
        longitude,
      };
      const { createPin } = await client.request(
        CREATE_PIN_MUTATION,
        variables
      );
      handleDeleteDraft();
      setSubmitting(false);
      console.log("pin created", { createPin });
      dispatch({ type: "CREATE_PIN", payload: createPin });
    } catch (error) {
      setSubmitting(false);
      console.log(error);
    }
  };

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "dmxp0i0sh");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dmxp0i0sh/image/upload",
      data
    );
    return res.data.url;
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        noWrap
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge}></LandscapeIcon>
        Pin location
      </Typography>
      <div>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          label="Title"
          placeholder="Insert pin title"
        ></TextField>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
        ></input>
        <label htmlFor="image">
          <Button component="span" size="small" className={classes.button}>
            <AddAPhotoIcon></AddAPhotoIcon>
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          onChange={(e) => setContent(e.target.value)}
          name="content"
          label="Content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
        ></TextField>
      </div>
      <div>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon}></ClearIcon>
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon}></SaveIcon>
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
