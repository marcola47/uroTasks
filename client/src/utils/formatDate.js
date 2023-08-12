export default function formatDate(inputDate, format) 
{
  const date = new Date(inputDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  if (format === 'd/m/y')
    return `${day}/${month}/${year}`;

  if (format === 'm/d/y')
    return `${month}/${day}/${year}`;

  if (format === 'y/m/d')
    return `${year}/${month}/${day}`;
}