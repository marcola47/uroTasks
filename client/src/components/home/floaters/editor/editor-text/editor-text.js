import { useState, useContext, useEffect, useRef } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

export default function EditorText({ task }) 
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);
  
  const [inputValue, setInputValue] = useState(task.content);
  const taskTextRef = useRef();

  function handleContentChange(newContent)
  {
    if (newContent === "")
      return;
    
    let isNewContent = false;

    const taskList = structuredClone(activeProject.tasks).map(listTask => 
    {
      if (listTask.id === task.id && listTask.content !== newContent)
      {
        listTask.content = newContent;
        isNewContent = true;
      }

      return listTask;
    });

    const projectsOld = structuredClone(projects);
    const projectsCopy = structuredClone(projects).map(project => 
    {
      if (project.id === activeProject.id)
      {
        project.tasks = taskList;
        project.updated_at = Date.now();
      }

      return project;
    });

    if (isNewContent)
    {
      setProjects(projectsCopy)
      axios.post(`/a/task/update?type=content`, 
      {
        projectID: activeProject.id,
        taskID: task.id, 
        newContent: newContent
      })
      .catch(err => 
      {
        setResponseError(err, dispatch);
        setProjects(projectsOld)
      })
    }
  }

  useEffect(() => // set editor styles when shown
  {
    if (task)
    {
      const textArea = document.getElementById('editor__text-area');
      const end = textArea.value.length;
    
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
      
      textArea.setSelectionRange(end, end);
      textArea.focus();
    }

  }, [task])

  function handleSave(e) 
  {
    if (taskTextRef.current.value !== task.content)
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
      onChange={ e => setInputValue(e.target.value) } 
      onBlur={ e => {handleSave(e)} } 
      onKeyDown={ handleKeyDown }
      onInput={ handleInputGrowth }
    />
  );
}