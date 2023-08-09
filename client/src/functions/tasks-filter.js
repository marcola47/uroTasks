export default function filterTasks(taskList, filters, type)
{
  if (type !== 'all')
    taskList = taskList.filter(task => task.type === type).sort((a, b) => { return a.position - b.position })

  if (filters.keywords !== '')
  {
    // implement exact or any match (current: any)
    const trimmedKeywords = filters.keywords.trim();
    const keywordsArray = trimmedKeywords.split(' ');
    taskList = taskList.filter(listTask => { return keywordsArray.some(keyword => listTask.content.toLowerCase().includes(keyword)) })
  }

  // if (filters.date)
  // {

  // }

  if (filters.tags.length > 0)
    taskList = taskList.filter (listTask => { return filters.tags.every(tag => listTask.tags.includes(tag)) })

  return taskList;
}