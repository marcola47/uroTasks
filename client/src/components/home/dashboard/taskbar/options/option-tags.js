import { useContext } from "react";
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags()
{
  const { state, dispatch } = useContext(ReducerContext);

  function toggleTagsOptions()
  {
    if (state.projectOptions)
      dispatch({ type: 'setProjOptions', payload: null })

    else
      dispatch({ type: 'setProjOptions', payload: 'tags-display' })
  }

  return (
    <div className="taskbar__option taskbar__option--tags" onClick={ toggleTagsOptions }>
      <FontAwesomeIcon icon={ faTag }/>  
    </div>
  )
}