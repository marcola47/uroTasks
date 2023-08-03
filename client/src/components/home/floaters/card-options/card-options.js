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
import OptionCopyList from "./options/option-list-copy";
import OptionArchiveList from "./options/option-list-archive";
import OptionDeleteList from "./options/option-list-delete";

export default function CardOptions()
{
  const { state, dispatch } = useContext(ReducerContext);

  const optionsStyle = 
  {
    left: state.cardParams?.x ?? 0, 
    top: state.cardParams?.y ?? 0,
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
      state.cardData && 
      <div className='card__options' style={ optionsStyle } onClick={ e => {e.stopPropagation()} }>
        <OptionSort type={ state.cardData }/>
        <OptionFilter type={ state.cardData }/>
        <div className="separator"/>
        <OptionMoveTasks type={ state.cardData }/>
        <OptionCopyTasks type={ state.cardData }/>
        <OptionArchiveTasks type={ state.cardData }/>
        <OptionDeleteTasks type={ state.cardData }/>
        <div className="separator"/>
        <OptionMoveList type={ state.cardData }/>
        <OptionCopyList type={ state.cardData }/>
        <OptionArchiveList type={ state.cardData }/>
        <OptionDeleteList type={ state.cardData }/>
      </div>
    }
    </TransitionOpacity>
  )
}