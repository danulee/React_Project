import React, { useState, useRef } from "react";
import { AppBar , Toolbar ,TextField ,Button } from "@mui/material";

//기능 함수들
function useTodosState() {
  const [todos, setTodos] = useState([]);
  const lastTodoIdRef = useRef(0);

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  };

  const modifyTodo = (index, newContent) => {
    const newTodos = todos.map((todo, _index) =>
      _index != index ? todo : { ...todo, content: newContent }
    );
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, _index) => _index != index);
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
  };
}


//할일 리스트
function TodoList({ todosState }) {
  return (
    <ul>
      {todosState.todos.map((todo, index) => (
        <TodoListItem
          todosState={todosState}
          key={todo.id}
          todo={todo}
          index={index}
        />
      ))}
    </ul>
  );
}


//할일 리스트 보여주기
function TodoListItem({ todosState, todo, index }) {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);
  const editedContentInputRef = useRef(null);

  const removeTodo = () => {
    todosState.removeTodo(index);
  };

  const showTodo = () => {
    setEditMode(true);
  };

  const commitEdit = () => {
    if (editedContent.trim().length == 0) {
      alert("할일을 입력해주세요.");
      editedContentInputRef.current.focus();
      return;
    }

    todosState.modifyTodo(index, editedContent.trim());

    setEditMode(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditedContent(todo.content);
  };

  return (
    <li>
      <br />
      <span className="font-bold mx-5 p-5">{todo.id}</span>

      <span className="mx-5 p-5">{todo.regDate}</span>

      {editMode || (
        <>
           <span className="mx-5 p-5">{todo.content}</span>
          <Button variant="outlined" onClick={showTodo}>수정</Button>
        </>
      )}
      {editMode && (
        <>
          <input
            type="text"
            placeholder="할일을 입력해주세요."
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          &nbsp;
          <Button variant="outlined" onClick={commitEdit}>수정완료</Button>
          &nbsp;
          <Button variant="outlined" onClick={cancelEdit}>수정취소</Button>
        </>
      )}
       &nbsp;
      <Button variant="outlined" onClick={removeTodo}>삭제</Button>
    </li>
  );
}


//메인 (&할일 적어서 받기)
function App() {
  const todosState = useTodosState();
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert("할일을 입력해주세요.");
      form.content.focus();

      return;
    }

    todosState.addTodo(form.content.value);
    form.content.value = "";
    form.content.focus();
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-1"></div>
          <span className="font-bold">HAPPY NOTE</span>
          <div className="flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <form onSubmit={onSubmit} className="flex flex-col mt-4 px-4 gap-2">
        <TextField
          autoComplete="off"
          name="content"
          label="할일을 입력해주세요."
          variant="outlined"
        />
        <Button type="submit" variant="contained">추가</Button>
      </form>
      <TodoList todosState={todosState} />
    </>
  );
}


//유틸
// 날짜 객체 입력받아서 문장(yyyy-mm-dd hh:mm:ss)으로 반환한다.
function dateToStr(d) {
  const pad = (n) => {
    return n < 10 ? "0" + n : n;
  };

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

export default App;