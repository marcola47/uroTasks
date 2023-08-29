import { useState, useContext, useEffect } from "react"
import { ReducerContext } from "app"

import { ButtonGlow } from "components/utils/buttons/buttons";
import { TransitionOpacity } from "components/utils/transitions/transitions"

import ProjStart from './options/option-start'
import ProjSort from "./options/option-sort";
import ProjFilter from "./options/option-filter";
import { ProjTagsDisplay, ProjTagsEditor } from './options/option-tags';

import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ProjOptions()
{
  const { state, dispatch } = useContext(ReducerContext);
  const [prev, setPrev] = useState(null);

  useEffect(() => 
  {  
    switch (state.projOptions)
    {
      case 'tags-editor': setPrev('tags-display'); break;
      case 'start'      : setPrev(null); break;
      default           : setPrev('start'); break;
    }

  }, [state.projOptions])

  function ProjOptionsContent()
  {
    switch (state.projOptions)
    {
      case 'start'       : return <ProjStart/>
      case 'sort'        : return <ProjSort/>
      case 'filter'      : return <ProjFilter/>
      case 'tags-display': return <ProjTagsDisplay/>
      case 'tags-editor' : return <ProjTagsEditor/>
      default            : return null;
    }
  }
  
  return (
    <TransitionOpacity 
      className="overlay__bg--mid" 
      onClick={ () => {dispatch({ type: 'setProjOptions', payload: null })} }
    >
      <div 
        className="proj-options" 
        onClick={ e => {e.stopPropagation()} }
      >
        <div className="proj-options__header">
          <ButtonGlow 
            icon={ faArrowLeft } 
            fontSize="1.8rem" 
            onClick={ () => {dispatch({ type: 'setProjOptions', payload: prev })} }
          />

          <h2 
            className="proj-options__title"
            children="PROJECT SETTINGS"
          />

          <ButtonGlow 
            icon={ faXmark } 
            onClick={ () => {dispatch({ type: 'setProjOptions', payload: null })} }
          />
        </div>

        <div 
          className="proj-options__content"
          children={ <ProjOptionsContent/> }
        />
      </div>
    </TransitionOpacity>
  )
}