import { HeaderColor, HeaderTitle } from './header/header'
import OptionSort from './options/option-sort';
import OptionFilter from './options/option-filter';
import OptionTags from './options/option-tags';
import OptionClone from './options/option-clone';
import OptionDelete from './options/option-delete';
import OptionEllipsis from './options/option-ellipsis'

export default function Taskbar()
{
  return (
    <div className="taskbar">
      <h1 className="taskbar__header">
        <HeaderColor/>
        <HeaderTitle/>
      </h1>

      <div className="taskbar__options">
        <OptionFilter/>
        <OptionSort/>
        <OptionTags/>
        <OptionClone/>
        <OptionDelete/>
        <OptionEllipsis/>
      </div>
    </div>
  )
}