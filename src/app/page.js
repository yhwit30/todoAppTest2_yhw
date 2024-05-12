'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import {
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  TextField,
  Chip
} from '@mui/material';
import { FaBars, FaCheck, FaEllipsisH } from 'react-icons/fa';
import RootTheme from './theme';
import dateToStr from './dateUtil';


function saveTodosToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
  const todosJSON = localStorage.getItem('todos');
  return todosJSON ? JSON.parse(todosJSON) : [];
}

function useTodosState() {
  const [todos, setTodos] = React.useState(loadTodosFromLocalStorage());

  const addTodo = (newContent) => {
    const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  const removeTodo = (id) => {
    if (confirm(`${id}번 할 일을 삭제하시겠습니까?`) == true){
      const newTodos = todos.filter((todo) => todo.id != id);
      setTodos(newTodos);
      saveTodosToLocalStorage(newTodos);
    }
  };

  const modifyTodo = (id, content) => {
    const newTodos = todos.map((todo) => (todo.id != id ? todo : { ...todo, content }));
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
  };
}



const NewTodoForm = ({ todosState }) => {
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    todosState.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
  };

  return (
    <>
        <form onSubmit={(e) => onSubmit(e)} className="tw-flex tw-flex-col tw-p-4 tw-gap-2">
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          name="content"
          autoComplete="off"
          label="할 일 써"
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
    </>
  );
};

function useEditTodoModalStatus() {
  const [opened, setOpened] = React.useState(false);

  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
  };
}

const TodoListItem = ({ todo, index, removeTodo, modifyTodo }) => {


  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    // modify v1
    modifyTodo(todo.id, form.content.value);
    editTodoModalStatus.close();


  };

  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); 
  };

  const editTodoModalStatus = useEditTodoModalStatus();

  return (
    <>
      <li key={todo.id}>
        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-3">
          <div className="tw-flex tw-gap-x-2 tw-font-bold">
            <Chip className="tw-pt-[3px]" label={`번호 : ${todo.id}`} variant="outlined" />
            <Chip
              className="tw-pt-[3px]"
              label={`날짜 : ${todo.regDate}`}
              variant="outlined"
              color="primary"
            />
          </div>
          <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px] tw-min-h-[80px]">
            <Button className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px]" color="inherit">
              <FaCheck
                className={classNames(
                  'tw-text-3xl',
                  {
                    'tw-text-[--mui-color-primary-main]': isClicked,
                  },
                  { 'tw-text-[#dcdcdc]': !isClicked },
                )}
                onClick={handleClick} 
              />
            </Button>
            <div className="tw-bg-[#dcdcdc] tw-w-[2px] tw-h-[60px] tw-self-center"></div>

            {editTodoModalStatus.opened ? (
              <>
               <form onSubmit={onSubmit} className="tw-bg-blue-300 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
        <TextField
          minRows={1}
          maxRows={3}
          multiline
          name="content"
          autoComplete="off"
          label="할 일 써"
          defaultValue={todo.content}
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          수정완료
        </Button>
      </form>
              </>
            ) : (
              <>
               <div onClick={editTodoModalStatus.open} className="tw-bg-blue-300 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
              {todo.content}
            </div>
              </>
            )}
             
           
         
            <Button className="tw-flex-shrink-0 tw-rounded-[0_10px_10px_0]" color="inherit" onClick={() => removeTodo(todo.id)}>
                삭제
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

const TodoList = ({ todosState }) => {

  const todoLocal = JSON.parse(localStorage.getItem("todos")) || [];

  // 할 일 목록을 내림차순으로 정렬
  const sortedTodoLocal = todoLocal.slice().reverse();

  return (
    <>
      {/* 할 일 갯수 : {todosState.todos.length} */}
      할 일 갯수 : {sortedTodoLocal ? sortedTodoLocal.length : 0}
      <nav>
        <ul>
          {Array.isArray(sortedTodoLocal) && sortedTodoLocal.map((todo, index) => (
            <TodoListItem key={todo.id} todo={todo} index={index} removeTodo={todosState.removeTodo} modifyTodo={todosState.modifyTodo} />
          ))}
        </ul>
      </nav>
    </>
  );
};

function App() { 

  const todosState = useTodosState(); // 리액트 커스텀 훅

  // React.useEffect(() => {
  //   todosState.addTodo('스쿼트\n런지');
  //   todosState.addTodo('벤치');
  //   todosState.addTodo('데드');
  // }, []);


  const a = localStorage.getItem("todos");
  console.log(a);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="tw-flex-1">
          </div>
          <div className="logo-box">
            <a href="/" className="tw-font-bold">
              TODO!
            </a>
          </div>
          <div className="tw-flex-1 tw-flex tw-justify-end">
           
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NewTodoForm todosState={todosState} />
      <TodoList todosState={todosState} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}