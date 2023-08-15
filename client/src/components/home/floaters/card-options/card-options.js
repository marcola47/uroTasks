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

export default function CardOptions()
{
  const { state, dispatch } = useContext(ReducerContext);

  const optionsStyle = 
  {
    left: state.cardOptions.params?.x ?? 0, 
    top: state.cardOptions.params?.y ?? 0,
  }

  function hideOptions()
  {
    dispatch(
    { 
      type: 'setCardOptions', 
      payload: 
      { 
        params: null, 
        data: null 
      } 
    })
  }

  return (
    <TransitionOpacity className="overlay__bg--light" onClick={ hideOptions } id='card-options'>
    {
      state.cardOptions.data && 
      <div className='card__options' style={ optionsStyle } onClick={ e => {e.stopPropagation()} }>
        <OptionSort type={ state.cardOptions.data }/>
        <OptionFilter type={ state.cardOptions.data }/>
        <div className="separator"/>
        <OptionMoveTasks type={ state.cardOptions.data }/>
        <OptionCopyTasks type={ state.cardOptions.data }/>
        <OptionArchiveTasks type={ state.cardOptions.data }/>
        <OptionDeleteTasks type={ state.cardOptions.data }/>
        <div className="separator"/>
        <OptionMoveList type={ state.cardOptions.data }/>
        <OptionCloneList type={ state.cardOptions.data }/>
        <OptionArchiveList type={ state.cardOptions.data }/>
        <OptionDeleteList type={ state.cardOptions.data }/>
      </div>
    }
    </TransitionOpacity>
  )
}