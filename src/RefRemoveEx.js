import React, { useState, useRef } from "react";

function RefRemoveEx() {
  const noInputRef = useRef(null);
  const [no, setNo] = useState("");
  const [recordedNos, setRecordedNos] = useState([
    5, 10, 15, 5, 20, 25, 5, 30, 35, 40, 45, 50,
  ]);

  const saveNo = () => {
    if (no === "") {
      alert("숫자를 입력해주세요.");
      return;
    }

    setRecordedNos([...recordedNos, no]);
    setNo("");
    noInputRef.current.focus();
  };

  const removeNo = (index) => {
    const newRecorededNos = recordedNos.filter((_, _index) => _index != index);
    setRecordedNos(newRecorededNos);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveNo();
        }}
      >
        <input
          type="number"
          ref={noInputRef}
          value={no}
          onChange={(e) => setNo(e.target.valueAsNumber)}
        />
        <button type="submit">기록</button>
      </form>

      <hr />

      <h1>기록된 숫자</h1>
      <ul>
        {recordedNos.map((el, index) => (
          <li key={index}>
            <sapn style={{ width: 70, display: "inline-block" }}>{el}</sapn>
            <sapn style={{ width: 70, display: "inline-block" }}>{index}</sapn>
            <button onClick={() => removeNo(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default RefRemoveEx;
