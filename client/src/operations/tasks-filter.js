function getDateDiff(taskDate, today)
{
  const dueDate = new Date(taskDate).getTime();
  return (dueDate - today) / 1000 / 60 / 60 / 24
}

export default function filterTasks(taskList, filters, type)
{
  taskList = taskList.filter(task => task.type === type).sort((a, b) => { return a.position - b.position })

  if (filters.keywords !== '')
  {
    // implement exact or any match (current: any)
    const trimmedKeywords = filters.keywords.trim();
    const keywordsArray = trimmedKeywords.split(' ');
    taskList = taskList.filter(listTask => { return keywordsArray.some(keyword => listTask.content.toLowerCase().includes(keyword)) })
  }

  if (filters.date)
  {
    const curTimeStamp = new Date().setUTCHours(0, 0, 0, 0);

    switch (filters.date)
    {
      case 'overdue':
        taskList = taskList.filter(task => 
        {
          const dateDiff = getDateDiff(task.due_date, curTimeStamp);
          if (dateDiff < 0 && dateDiff > -19300) return task;
        }); break;

      case 'today':
        taskList = taskList.filter(task => 
        {
          const dateDiff = getDateDiff(task.due_date, curTimeStamp);
          if (dateDiff === 0) return task;
        }); break;
      
      case 'tomorrow':
        taskList = taskList.filter(task => 
        {
          const dateDiff = getDateDiff(task.due_date, curTimeStamp);
          if (dateDiff === 1) return task;
        }); break;

      case 'week':
        taskList = taskList.filter(task => 
        {
          const dateDiff = getDateDiff(task.due_date, curTimeStamp);
          if (dateDiff <= 7 && dateDiff >= 0) return task;
        }); break;

      case 'month':
        taskList = taskList.filter(task => 
        {
          const dateDiff = getDateDiff(task.due_date, curTimeStamp);
          if (dateDiff <= 30 && dateDiff >= 0) return task;
        }); break;
    }
  }

  if (filters.tags.length > 0)
    taskList = taskList.filter (listTask => { return filters.tags.every(tag => listTask.tags.includes(tag)) })

  return taskList;
}