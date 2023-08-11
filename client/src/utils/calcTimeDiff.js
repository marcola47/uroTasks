export default function calcTimeDiff(dateStr1, dateStr2) 
{
  try 
  {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    
    return date2 - date1;
  } 
  
  catch (err) 
  {
    console.log(err);
    return null;
  }
}