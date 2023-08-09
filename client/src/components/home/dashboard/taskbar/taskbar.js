import { useContext } from 'react';
import { ReducerContext } from 'app';

import { HeaderColor, HeaderTitle } from './header/header'
import OptionSort from './options/option-sort';
import OptionFilter from './options/option-filter';
import { OptionFilterActive } from './options/option-filter';
import OptionTags from './options/option-tags';
import OptionClone from './options/option-clone';
import OptionDelete from './options/option-delete';
import OptionEllipsis from './options/option-ellipsis'

export default function Taskbar()
{
  const { state } = useContext(ReducerContext);

  const filtersActive = state.filters.keywords !== '' || state.filters.date || state.filters.tags.length > 0
    ? true
    : false

  return (
    <div className="taskbar">
      <h1 className="taskbar__header">
        <HeaderColor/>
        <HeaderTitle/>
      </h1>

      <div className="taskbar__options">
        { filtersActive ? <OptionFilterActive/> : <OptionFilter/> }
        <OptionSort/>
        <OptionTags/>
        <OptionClone/>
        <OptionDelete/>
        <OptionEllipsis/>
      </div>
    </div>
  )
}