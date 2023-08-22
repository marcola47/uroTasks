import React, { useContext } from "react";
import { ProjectsContext, ReducerContext } from "app";
import axios, { setResponseError } from 'utils/axiosConfig'
import { DragDropContext } from "react-beautiful-dnd";

import AddTaskList from "./add-task-list/add-task-list";
import TaskList from './task-list/task-list';
import { DroppableList } from "components/utils/list/list";

import repositionLists from "operations/lists-reposition";
import repositionTasks from "operations/tasks-reposition";

function Tasks()
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  const typesOrdered = structuredClone(activeProject.types).sort((a, b) => {return a.position - b.position})

  const onDragEnd = result =>
  {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index))
      return;

    const projectsContext = { projects, setProjects, activeProject };
    const opContext = { dispatch, result, axios, setResponseError }

    if (result.type === "type-list")
      repositionLists(projectsContext, opContext)

    else if (result.type === "task-list")
      repositionTasks(projectsContext, opContext)
  }

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <DroppableList
        droppableId="tasks"
        direction="horizontal"
        type="type-list"
        ListItem={ TaskList }
        elements={ typesOrdered }
        className="tasks"
        id="tasks"
        extraChildren={ <AddTaskList typesOrdered={ typesOrdered }/> }
      />
    </DragDropContext>
  )
}

const MemoizedTasks = React.memo(Tasks);
export default MemoizedTasks;