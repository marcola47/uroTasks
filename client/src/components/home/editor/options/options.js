import OptionEllipsis from './_option-ellipsis'
import OptionTags from './_option-tags';
import OptionType from './_option-type';
import OptionPosition from './_option-position';  
import OptionDelete from './_option-delete';

export default function TaskOptions({ task })
{
  return (
    <div className='options'>
      <OptionEllipsis/>
      <OptionTags task={ task }/>
      <OptionType task={ task }/>
      <OptionPosition task={ task }/>
      <OptionDelete task={ task }/>
    </div>
  )
}