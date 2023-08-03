import { useContext } from "react";
import { ReducerContext } from "app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags()
{
  const { dispatch } = useContext(ReducerContext);

  return (
    <div className="taskbar__option taskbar__option--tags" onClick={ () => {} }>
      <FontAwesomeIcon icon={ faTag }/>  
    </div>
  )
}