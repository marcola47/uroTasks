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
    const curTime = new Date().setUTCHours(0, 0, 0, 0);

    switch (filters.date)
    {
      case 'overdue' : taskList = taskList.filter(task => { const diff = getDateDiff(task.due_date, curTime); return diff < 0 && diff > -19300 }); break;
      case 'today'   : taskList = taskList.filter(task => { const diff = getDateDiff(task.due_date, curTime); return diff === 0                }); break;
      case 'tomorrow': taskList = taskList.filter(task => { const diff = getDateDiff(task.due_date, curTime); return diff === 1                }); break;
      case 'week'    : taskList = taskList.filter(task => { const diff = getDateDiff(task.due_date, curTime); return diff <= 7 && diff > 1     }); break;
      case 'month'   : taskList = taskList.filter(task => { const diff = getDateDiff(task.due_date, curTime); return diff <= 30 && diff > 7    }); break;
      default        : break;
    }
  }

  if (filters.tags.length > 0)
    taskList = taskList.filter (listTask => { return filters.tags.every(tag => listTask.tags.includes(tag)) })

  return taskList;
}