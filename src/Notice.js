import React, { useState } from "react";
import classnames from "https://cdn.skypack.dev/classnames";

function NotifyOnce({ children }) {
  const [visible, setVisible] = useState(false);
  const [workDone, setWorkDone] = useState(false);

  if (workDone == false) {
    setTimeout(function () {
      setVisible(true);
    }, 1000);

    setTimeout(function () {
      setVisible(false);
    }, 3000);

    setWorkDone(true);
  }

  return (
    <div
      className={classnames(
        "fixed transition-all right-[10px]",
        { "top-[-60px]": !visible },
        { "top-[10px]": visible }
      )}
    >
      {children}
    </div>
  );
}

function Alert({ color: color_, children }) {
  const color = color_ ?? "pink";

  return (
    <div className="alert alert-info shadow-lg">
      <div className={`text-[${color}]`}>
        <span>
          <i className="fa-solid fa-circle-info"></i>
        </span>
        <span>{children}</span>
      </div>
    </div>
  );
}

function Notice() {
  return (
    <>
      <NotifyOnce>
        <Alert>"안녕" 반가워</Alert>
      </NotifyOnce>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
        doloremque voluptate doloribus minus. Eveniet laboriosam expedita
        tempora magni, eaque et, pariatur quis velit commodi aperiam nobis vero
        consectetur obcaecati earum!
      </div>
    </>
  );
}

export default Notice;
