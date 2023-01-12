import React, { useState } from "react";

function NoRecord() {
  const [no, setNo] = useState("");
  const [recordeNos, setRecordeNos] = useState([10, 20, 30]);

  const saveNo = (e) => {
    if (no === "") {
      alert("숫자를 입력해주세요.");
      return;
    }

    setRecordeNos([...recordeNos, no]);
    setNo("");
  };

  const li = recordeNos.map((el, index) => <li key={index}>- {el}</li>);

  return (
    <>
      <h1>숫자기록</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveNo();
        }}
      >
        <input
          type="number"
          value={no}
          onChange={(e) => setNo(e.target.valueAsNumber)}
          className="input w-full max-w-xs"
        />
        <button type="submit" className="btn btn-outline">
          기록
        </button>
      </form>

      <br />

      <h1>기록된 숫자 v1: {recordeNos.join(",")}</h1>

      <br />

      <h1>
        기록된 숫자 v2 : <ul>{li}</ul>
      </h1>

      <br />

      <h1>기록된 숫자 v2-1</h1>
      <ul>
        {recordeNos.map((el, index) => (
          <li key={index}>- {el}</li>
        ))}
      </ul>
    </>
  );
}

export default NoRecord;
