import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { TypeType } from "../../../../Utils/Types";

const SearchBar: React.FC<{ style: any }> = ({ style }) => {
  const [types, setTypes] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", { filter: {}, requestId });
    Server.on(`receive-${requestId}`, response => {
      setTypes([{ name_plural: "All" }, ...response]);
    });
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
    };
  }, []);

  // UI
  return (
    <div className={styles.root} style={style}>
      <span className={styles.leftInput}>
        <Autocomplete
          id="type"
          options={types && types}
          loading={!types ? true : false}
          getOptionLabel={
            types
              ? (option: TypeType) => {
                  return option.name_plural;
                }
              : (option: TypeType) => {
                  return "";
                }
          }
          style={{ display: "inline-block" }}
          renderInput={params => (
            <TextField
              {...params}
              label="Type"
              variant="outlined"
              style={{ width: 150 }}
            />
          )}
        />
      </span>
      <span className={styles.rightInput}>
        <Autocomplete
          id="combo-box-demo"
          autoHighlight
          disableClearable
          loading
          style={{ display: "inline-block" }}
          renderInput={params => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              style={{ width: 300 }}
            />
          )}
        />
      </span>
    </div>
  );
};

export default SearchBar;
