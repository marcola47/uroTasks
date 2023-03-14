import { useState } from 'react';

export default function ItemText({ value, onChange }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  function handleInputChange(e) 
  {
    setInputValue(e.target.value);
  }

  function handleEdit() 
  {
    setEditing(true);
  }

  function handleSave() 
  {
    setEditing(false);
    onChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  return (
    <div className='list-item-text'>
      {
        editing ? (<input style={{width: '100%'}} autoFocus type="text" value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown}/>) 
                : (<div style={{width: '100%'}} onClick={handleEdit}>{value}</div>)
      }
    </div>
  );
}