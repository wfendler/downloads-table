import styles from "./TableRow.module.css";

function TableRow({ name, device, path, status, checked, handleChange }) {
  return (
    <tr
      tabIndex={0}
      className={`${styles.row} ${checked ? styles.rowSelected : ""}`}
    >
      <td className={styles.cell}>
        <label htmlFor={`select-${name}`}>
          <span className="sr-only">Select this file</span>
          <input
            id={`select-${name}`}
            name="asdf"
            type="checkbox"
            checked={checked}
            onChange={() => {
              handleChange({ name, device });
            }}
            disabled={status === "scheduled"}
          />
        </label>
      </td>
      <th scope="row" className={styles.cell}>
        {name}
      </th>
      <td className={styles.cell}>{device}</td>
      <td className={`${styles.cell} ${styles.path}`}>{path}</td>
      <td className={`${styles.cell} ${styles.status}`}>
        <span className={status === "available" ? styles.statusAvailable : ""}>
          {status}
        </span>
      </td>
    </tr>
  );
}

export default TableRow;
