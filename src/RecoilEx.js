import React, {useState} from "react";
import { Button } from "@mui/material";
import { atom } from "recoil";


// const page1NoAtom = {//전역변수로 선언 > 상태 유지
//     key : "RecoliEx/page1NoAtom",
//     default : 0
// }

// const page2NoAtom = {
//     key : "RecoliEx/page2NoAtom",
//     default : 0
// }


function Page1() {
    const [no, setNo] = useState(0);

    
    return (
      <>
        <h1>페이지 1</h1>
        
        <ul>
          <li>페이지 1의 숫자 : {no}</li>
          <li><Button onClick={() => setNo(no + 10)} variant = "outlined">페이지 1의 숫자 증가</Button></li>
          <li><Button onClick={() => setNo(no - 10)} variant = "outlined">페이지 1의 숫자 감소</Button></li>
        </ul>
      </>
    )
  }
  
  function Page2() {
    const [no, setNo] = useState(0);

    
    return (
      <>
        <h1>페이지 2</h1>
        
        <ul>
          <li>페이지 2의 숫자 : {no}</li>
          <li><Button onClick={() => setNo(no + 10)} variant = "outlined">페이지 2의 숫자 증가</Button></li>
          <li><Button onClick={() => setNo(no - 10)} variant = "outlined">페이지 2의 숫자 감소</Button></li>
        </ul>
      </>
    )
  }
  
  export default function RecoilEx() {
    const [pageName, setPageName] = useState('page1');
    
    const switchPage = () => setPageName(pageName == 'page1' ? 'page2' : 'page1');
    
    return <>
      <Button onClick={switchPage} variant ="outlined">
        스위치
      </Button>
       {pageName == 'page1' && <Page1 />}
       {pageName == 'page2' && <Page2 />}
    </>;
  }