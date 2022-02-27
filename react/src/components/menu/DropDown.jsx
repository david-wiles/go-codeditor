import React, {useState} from "react";
import styles from '../custom.module.scss';

const DropDown = (props) => {
  const [isOpen, setOpen] = useState(false);
  const [style, setStyle] = useState({});

  const positionElement = (x, y) => {
    return {
      position: 'absolute',
      top: x,
      left: y
    };
  };

  return (
    <>
      <span className={isOpen ? [styles.dropdownTab, styles.active].join(' ') : styles.dropdownTab}
           onClick={(e) => {
             setOpen((open) => !open);
             setStyle(positionElement(e.target.offsetTop + e.target.offsetHeight, e.target.offsetLeft));
           }}>
        {props.title}
      </span>
      <div className={isOpen ? styles.openMenu : styles.hidden}
           style={style}>
        {props.actions}
      </div>
    </>
  );
};

export default DropDown;
