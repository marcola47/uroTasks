import { useState, useContext, useEffect, useRef } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

export default function EditorText() 
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);
  
  const [inputValue, setInputValue] = useState(state.editor.data.content);
  const taskTextRef = useRef();

  function handleContentChange(newContent)
  {
    if (newContent === "")
      return;
    
    let isNewContent = false;

    const tasksOld = structuredClone(activeProject.tasks);
    const taskList = structuredClone(activeProject.tasks).map(taskObj => 
    {
      if (taskObj.id === state.editor.data.id && taskObj.content !== newContent)
      {
        taskObj.content = newContent;
        isNewContent = true;
      }

      return taskObj;
    });

    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    });

    setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }));

    if (isNewContent)
    {
      axios.post(`/a/task/update?type=content`, 
      {
        taskID: state.editor.data.id, 
        newContent: newContent
      })
      .then(() => setProjects(projectsCopy))
      .catch(err => 
      {
        setResponseError(err, dispatch);
        setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: tasksOld }));
      })
    }
  }

  useEffect(() => // set editor styles when shown
  {
    if (state.editor.data)
    {
      const textArea = document.getElementById('editor__text-area');
      const end = textArea.value.length;
    
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
      
      textArea.setSelectionRange(end, end);
      textArea.focus();
    }

  }, [state.editor.data])

  function handleSave(e) 
  {
    if (taskTextRef.current.value !== state.editor.data.content)
      handleContentChange(inputValue);

    const editorBg = document.querySelector('.editor__bg');

    if (e.target === editorBg)
    {
      dispatch(
      {
        type: 'setEditor',
        payload: { params: null, dat: null }
      })
    }
  }

  function handleKeyDown(e)
  {
  
    if (e.key === "Enter")
    {
      const textArea = document.getElementById('editor__text-area');
      textArea.blur();

      handleSave(e);
      dispatch(
      {
        type: 'setEditor',
        payload: { params: null, dat: null }
      })
    }
  }

  function handleInputGrowth()
  {
    const textArea = document.getElementById('editor__text-area');

    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  return (
    <textarea  
      id='editor__text-area' 
      ref={ taskTextRef } 
      value={ inputValue } 
      onChange={ e => {setInputValue(e.target.value);} } 
      onBlur={ e => {handleSave(e)} } 
      onKeyDown={ handleKeyDown }
      onInput={ handleInputGrowth }
    />
  );
}