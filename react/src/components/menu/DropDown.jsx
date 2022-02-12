import React, {useState} from "react";
import styles from '../custom.module.scss';

const DropDown = (props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className={isOpen ? [styles.dropdownTab, styles.activeDropdownTab].join(' ') : styles.dropdownTab}
           onClick={() => setOpen((open) => !open)}>
        {props.title}
      </div>
      <div className={isOpen ? styles.openMenu : styles.hidden}>
        {props.actions}
      </div>
    </>
  );
};

export default DropDown;
