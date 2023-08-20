import { useContext } from "react";
import { ReducerContext } from "app";

import { TransitionOpacity } from "components/utils/transitions/transitions";
import OptionSort from "./options/option-sort";
import OptionFilter from "./options/option-filter";
import OptionMoveTasks from "./options/option-tasks-move";
import OptionCopyTasks from "./options/option-tasks-copy";
import OptionArchiveTasks from "./options/option-tasks-archive";
import OptionDeleteTasks from "./options/option-tasks-delete";
import OptionMoveList from "./options/option-list-move";
import OptionCloneList from "./options/option-list-clone";
import OptionArchiveList from "./options/option-list-archive";
import OptionDeleteList from "./options/option-list-delete";

export default function TaskListOptions()
{
  const { state, dispatch } = useContext(ReducerContext);

  const optionsStyle = 
  {
    left: state.taskListOptions.params?.x ?? 0, 
    top: state.taskListOptions.params?.y ?? 0,
  }

  function hideOptions()
  {
    dispatch(
    { 
      type: 'setTaskListOptions', 
      payload: 
      { 
        params: null, 
        data: null 
      } 
    })
  }

  return (
    <TransitionOpacity className="overlay__bg--light" onClick={ hideOptions } id='task-list-options'>
    {
      state.taskListOptions.data && 
      <div className='task-list__options' style={ optionsStyle } onClick={ e => {e.stopPropagation()} }>
        <OptionSort type={ state.taskListOptions.data }/>
        <OptionFilter type={ state.taskListOptions.data }/>
        <div className="separator"/>
        <OptionMoveTasks type={ state.taskListOptions.data }/>
        <OptionCopyTasks type={ state.taskListOptions.data }/>
        <OptionArchiveTasks type={ state.taskListOptions.data }/>
        <OptionDeleteTasks type={ state.taskListOptions.data }/>
        <div className="separator"/>
        <OptionMoveList type={ state.taskListOptions.data }/>
        <OptionCloneList type={ state.taskListOptions.data }/>
        <OptionArchiveList type={ state.taskListOptions.data }/>
        <OptionDeleteList type={ state.taskListOptions.data }/>
      </div>
    }
    </TransitionOpacity>
  )
}