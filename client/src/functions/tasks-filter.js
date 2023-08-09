export default function filterTasks(projectsContext, filters, list)
{
  const { projects, setProjects, activeProject } = projectsContext;
  
  if (list === 'all')
    console.log('filtered all')

  else
    console.log(`filtered ${list}`)

  console.log(filters);

  return true;
}