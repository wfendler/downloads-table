import React, { useState, useEffect, useRef } from "react";
import TableRow from "./TableRow";

import styles from "./Table.module.css";

const allCheckedStates = {
  checked: "CHECKED",
  empty: "EMPTY",
  indeterminate: "INDETERMINATE",
};

function Table({ data }) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [allChecked, setAllChecked] = useState(allCheckedStates.empty);
  const allCheckedRef = useRef();

  const selectAll = () => {
    const newFiles = [...files].map((item) => {
      if (item.status === "scheduled") return item;
      return { ...item, checked: true };
    });
    setFiles(newFiles);
  };

  const deselectAll = () => {
    const newFiles = [...files].map((item) => {
      if (item.status === "scheduled") return item;
      return { ...item, checked: false };
    });
    setFiles(newFiles);
  };

  // Set our `files` state based on the data being passed and add a `checked`
  // property to each one, defaulting to `false`
  useEffect(() => {
    if (!data) return;
    const dataWithChecked = data.map((item) => {
      return { ...item, checked: false };
    });
    setFiles(dataWithChecked);
  }, [data]);

  // Update allChecked state to set state to checked | empty | indeterminate
  // based on changes to the file selection
  useEffect(() => {
    if (!files) return;
    const availableFiles = files.filter((item) => item.status === "available");
    const selectedFiles = availableFiles.filter(
      (item) => item.checked === true
    );
    setSelectedFiles(selectedFiles);
    if (selectedFiles.length < 1) {
      setAllChecked(allCheckedStates.empty);
    } else if (selectedFiles.length === availableFiles.length) {
      setAllChecked(allCheckedStates.checked);
    } else {
      setAllChecked(allCheckedStates.indeterminate);
    }
  }, [files]);

  // When allChecked state changes, update the checkbox DOM element's accordingly
  useEffect(() => {
    if (!allCheckedRef.current) return;
    switch (allChecked) {
      case allCheckedStates.checked:
        allCheckedRef.current.checked = true;
        allCheckedRef.current.indeterminate = false;
        break;
      case allCheckedStates.empty:
        allCheckedRef.current.checked = false;
        allCheckedRef.current.indeterminate = false;
        break;
      case allCheckedStates.indeterminate:
        allCheckedRef.current.checked = false;
        allCheckedRef.current.indeterminate = true;
        break;
      default:
        break;
    }
  }, [allChecked, allCheckedRef]);

  // When a TableRow's onChange event is triggered set the "checked" property
  // to the opposite of its current value
  const handleFileChange = (file) => {
    const { name, device } = file;
    const newFiles = [...files].map((item) => {
      if (item.name === name && item.device === device) {
        item.checked = !item.checked;
      }
      return item;
    });
    setFiles(newFiles);
  };

  const handleAllChecked = (event) => {
    const isChecked = event.target.checked;
    setAllChecked(isChecked);
    if (isChecked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const downloadData = selectedFiles.map((item) => {
      return `${item.path}\n${item.device}`;
    });
    if (selectedFiles.length < 1) {
      alert("No files selected");
      return;
    }
    alert(downloadData.join("\n\n"));
  };

  if (!data) {
    return <div className={styles.empty}>No files available.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      {files && (
        <form onSubmit={handleSubmit}>
          <h1 className="sr-only">Download Files</h1>
          <div className={styles.controls}>
            <div className={styles.select}>
              <div className={styles.selectInput}>
                <label htmlFor="select-all">
                  <span className="sr-only">Select all files</span>
                  <input
                    id="select-all"
                    type="checkbox"
                    ref={allCheckedRef}
                    onChange={handleAllChecked}
                  />
                </label>
              </div>
              <div
                className={styles.selectCount}
                aria-live="polite"
                // https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22
                role="status"
              >
                {selectedFiles.length > 0
                  ? `Selected ${selectedFiles.length}`
                  : `None Selected`}
              </div>
            </div>
            <button type="submit" className={styles.button}>
              <svg
                aria-hidden={true}
                focusable={false}
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className={styles.buttonText}>Download Selected</span>
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.th}>
                  <span className="sr-only">Selected</span>
                </th>
                <th scope="col" className={styles.th}>
                  Name
                </th>
                <th scope="col" className={styles.th}>
                  Device
                </th>
                <th scope="col" className={styles.th}>
                  Path
                </th>
                <th scope="col" className={styles.th}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const { name, device, path, status, checked } = file;
                return (
                  <React.Fragment key={`${name}-${device}`}>
                    <TableRow
                      name={name}
                      device={device}
                      path={path}
                      status={status}
                      checked={checked}
                      handleChange={handleFileChange}
                    />
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <button type="submit" className="sr-only">
            Download Selected
          </button>
        </form>
      )}
    </div>
  );
}

export default Table;
