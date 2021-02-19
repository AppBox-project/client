import React from "react";
import { FaAddressBook, FaPlus } from "react-icons/fa";
import { AppContextType } from "../../../Utils/Types";
import { InterfaceType } from "../Types";
import styles from "./Logic.module.scss";

const AppSettingsInterfaceLogic: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
}> = ({ newInterface, context }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <>
      <div className={styles.row}>
        <div className={styles.diamond}>
          <div>Trigger</div>
        </div>
        <AddButton />
        {newInterface.data.data.logic.map((logicStep, index) => {
          return (
            <>
              <div className={styles.step}>
                <div>{logicStep.label}</div>
              </div>
              {newInterface.data.data.logic[index + 1] && <AddButton />}
            </>
          );
        })}
        <AddButton />
      </div>
    </>
  );
};

export default AppSettingsInterfaceLogic;

const AddButton: React.FC = () => (
  <div className={styles.add}>
    <div>
      <FaPlus />
    </div>
  </div>
);
