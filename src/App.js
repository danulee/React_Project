import React, { useState, useRef , useEffect ,useMemo} from "react";
import ReactDOM from "react-dom";

import classNames from "https://cdn.skypack.dev/classnames";

import {
  colors,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Link,
  Button,
  AppBar,
  Toolbar,
  TextField,
  Chip,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  Divider,
  Modal,
  Snackbar,
  Alert as MuiAlert
} from"@mui/material";

import RecoilEx from "./RecoilEx";

const Alert = React.forwardRef((props, ref) => {
  return (
    <MuiAlert {...props} ref={ref} variant="filled" />
  )
});

function useTodosState() {
  const [todos, setTodos] = useState([]);
  const lastTodoIdRef = useRef(0);

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date())
    };

    setTodos((todos) => [newTodo, ...todos]);
    
    return id;
  };

  const modifyTodo = (index, newContent) => {
    const newTodos = todos.map((todo, _index) =>
      _index != index ? todo : { ...todo, content: newContent }
    );
    setTodos(newTodos);
  };
  
  const modifyTodoById = (id, newContent) => {
    const index = findTodoIndexById(id);
    
    if ( index == -1 ) {
      return;
    }
    
    modifyTodo(index, newContent);
  }

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, _index) => _index != index);
    setTodos(newTodos);
  };

  const removeTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index != -1) {
      removeTodo(index);
    }
  };
  
  const findTodoIndexById = (id) => {
    return todos.findIndex((todo) => todo.id == id);;
  }
  
  const findTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }
    
    return todos[index];
  }

  return {
    todos,
    addTodo,
    modifyTodo,
    modifyTodoById,
    removeTodo,
    removeTodoById,
    findTodoById
  };
}

function TodoListItem({ todo, index, todosState, openDrawer }) {
  return (
    <>
      <li key={todo.id} className="mt-10">
        <div className="flex gap-2">
          <Chip
            label={`번호 : ${todo.id}`}
            variant="outlined"
            className="!pt-1"
          />
          <Chip
            label={todo.regDate}
            color="primary"
            variant="outlined"
            className="!pt-1"
          />
        </div>
        <div className="mt-4 shadow rounded-[20px] flex">
          <Button
            className="flex-shrink-0 !items-start !rounded-[20px_0_0_20px]"
            color="inherit"
          >
            <span
              className={classNames(
                "text-4xl",
                "h-[80px]",
                "flex items-center",
                {
                  "text-[color:var(--mui-color-primary-main)]": index % 2 == 0
                },
                { "text-[#dcdcdc]": index % 2 != 0 }
              )}
            >
              <i className="fa-solid fa-check"></i>
            </span>
          </Button>
          <div className="flex-shrink-0 my-5 w-[2px] bg-[#dcdcdc] mr-4"></div>
          <div className="whitespace-pre-wrap leading-relaxed hover:text-[color:var(--mui-color-primary-main)] flex-grow flex items-center my-5">
            {todo.content}
          </div>
          <Button
            onClick={() => openDrawer(todo.id)}
            className="flex-shrink-0 !items-start !rounded-[0_20px_20px_0]"
            color="inherit"
          >
            <span className="text-[#dcdcdc] text-2xl h-[80px] flex items-center">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </span>
          </Button>
        </div>
      </li>
    </>
  );
}

function useTodoOptionDrawerState() {
  const [todoId, setTodoId] = useState(null);
  const opened = useMemo(() => todoId !== null, [todoId]);
  const close = () => setTodoId(null);
  const open = (id) => setTodoId(id);

  return {
    todoId,
    opened,
    close,
    open
  };
}

function EditTodoModal({ state, todosState, todo, closeDrawer, noticeSnackbarState }) {
  const close = () => {
    state.close();
    closeDrawer();
  }
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    
    form.content.value = form.content.value.trim();
    
    if ( form.content.value.length == 0 ) {
      alert('할일을 입력해주세요.');
      form.content.focus();
      return;
    }
    
    todosState.modifyTodoById(todo.id, form.content.value);
    close();
    noticeSnackbarState.open(`${todo.id}번 할일이 수정되었습니다.`, "info");
  }
  
  return (
    <>
      <Modal
        open={state.opened}
        onClose={close}
        className="flex justify-center items-center"
      >
        <div className="bg-white rounded-[20px] p-7 w-full max-w-lg">
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <TextField
              minRows={3}
              maxRows={10}
              multiline
              autoComplete="off"
              name="content"
              label="할일을 입력해주세요."
              variant="outlined"
              defaultValue={todo?.content}
            />

            <Button type="submit" variant="contained">
              수정
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}

function useEditTodoModalState() {
  const [opened, setOpened] = useState(false);

  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close
  };
}

function TodoOptionDrawer({ todosState, state, noticeSnackbarState }) {
  const removeTodo = () => {
    if ( window.confirm(`${state.todoId}번 할일을 삭제하시겠습니까?`) == false ) {
      state.close();
      return;
    }
    
    todosState.removeTodoById(state.todoId);
    state.close();
    noticeSnackbarState.open(`${state.todoId}번 할일이 삭제되었습니다.`, "info");
  };

  const editTodoModalState = useEditTodoModalState();
  
  const todo = todosState.findTodoById(state.todoId);

  return (
    <>
      <EditTodoModal state={editTodoModalState} todosState={todosState} todo={todo} closeDrawer={state.close} noticeSnackbarState={noticeSnackbarState} />
      <SwipeableDrawer
        anchor={"bottom"}
        onOpen={() => {}}
        open={state.opened}
        onClose={state.close}
      >
        <List className="!py-0">
          <ListItem className="!pt-6 !p-5">
            <span className="text-[color:var(--mui-color-primary-main)]">
              {todo?.id}번
            </span>
            <span>&nbsp;</span>
            <span>할일에 대해서</span>
          </ListItem>
          <Divider />
          <ListItem
            className="!pt-6 !p-5 !items-baseline"
            button
            onClick={editTodoModalState.open}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            &nbsp;
            <span>수정</span>
          </ListItem>
          <ListItem
            className="!pt-6 !p-5 !items-baseline"
            button
            onClick={removeTodo}
          >
            <i className="fa-solid fa-trash-can"></i>
            &nbsp;
            <span>삭제</span>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function TodoList({ todosState, noticeSnackbarState }) {
  const todoOptionDrawerState = useTodoOptionDrawerState();

  return (
    <>
      <TodoOptionDrawer todosState={todosState} state={todoOptionDrawerState} noticeSnackbarState={noticeSnackbarState} />
      <div className="mt-4 px-4">
        <ul>
          {todosState.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={index}
              todosState={todosState}
              openDrawer={todoOptionDrawerState.open}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function NewTodoForm({ todosState, noticeSnackbarState }) {
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert("할일을 입력해주세요.");
      form.content.focus();

      return;
    }

    const newTodoId = todosState.addTodo(form.content.value);
    form.content.value = "";
    form.content.focus();
    noticeSnackbarState.open(`${newTodoId}번 할일이 추가되었습니다.`);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col mt-4 px-4 gap-2">
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          autoComplete="off"
          name="content"
          label="할일을 입력해주세요."
          variant="outlined"
        />

        <Button type="submit" variant="contained">
          추가
        </Button>
      </form>
    </>
  );
}

function NoticeSnackbar({state}) {
  return (
    <>
      <Snackbar
        open={state.opened}
        autoHideDuration={state.autoHideDuration}
        onClose={state.close}>
        <Alert severity={state.severity}>{state.msg}</Alert>
      </Snackbar>
    </>
  )
}

function useNoticeSnackbarState() {
  const [opened, setOpened] = useState(false);
  const [autoHideDuration, setAutoHideDuration] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [msg, setMsg] = useState(null);
  
  const open = (msg, severity = "success", autoHideDuration = 6000) => {
    setOpened(true);
    setMsg(msg);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
  }
  
  const close = () => {
    setOpened(false);
  }
  
  return {
    opened,
    open,
    close,
    autoHideDuration,
    severity,
    msg
  }
}

function App() {
  const todosState = useTodosState();
  const noticeSnackbarState = useNoticeSnackbarState();

  useEffect(() => {
    todosState.addTodo("운동\n스트레칭\n유산소\n상체\n하체볼륨 트레이닝");
    todosState.addTodo("명상");
    todosState.addTodo("공부");
  }, []);

  return (
    <>
      {/* <AppBar position="fixed">
        <Toolbar>
          <div className="flex-1"></div>
          <span className="font-bold">HAPPY NOTE</span>
          <div className="flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackbar state={noticeSnackbarState} />
      <NewTodoForm todosState={todosState} noticeSnackbarState={noticeSnackbarState} />
      <TodoList todosState={todosState} noticeSnackbarState={noticeSnackbarState}  /> */}
      <RecoilEx />
    </>
  );
}

const muiThemePaletteKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning"
];

function Root() {
  // Create a theme instance.
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"]
    },
    palette: {
      primary: {
        main: "#A26FCF",
        contrastText: "#ffffff"
      }
    }
  });

  useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));

// 유틸리티

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