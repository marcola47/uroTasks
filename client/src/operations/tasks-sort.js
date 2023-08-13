export default function sortTasks(taskList, method)
{
  switch (method)
  {
    case 'alpha-asc':
      return taskList.sort((a, b) => a.content.localeCompare(b.content));

    case 'alpha-desc':
      return taskList.sort((a, b) => b.content.localeCompare(a.content));

    case 'due-close':
      return taskList.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

    case 'due-far':
      return taskList.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())

    case 'creation-close':
      return taskList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    case 'creation-far':
      return taskList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    case 'update-close':
      return taskList.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())

    case 'update-far':
      return taskList.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    default:
      return taskList;
  }
}