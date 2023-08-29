# UroTasks
![preview](https://github.com/marcola47/uroTasks/assets/78169543/674388c9-9514-4429-9e0e-d3f7892f94e2)

#### Description
Task manager inspired by Trello and Click Up, combining what each of them do best in a simple to use and straightforward product.

#### Deploy
[Deploy link](https://urotasks.onrender.com/)

#### Stack
- Node.js (v16.19.1)
- Express (v4.18.2)
- MongoDB (v6.0.5)
- React (v18.2.0)

#### Dev environment
- VSCode
- MongoDBCompass
- MongoDBAtlas

#### CODE FORMATTING

- CURLY BRACES:
  Space them, like: `{ blablabla }`

- SEMICOLONS:
  Not necessary, not relevant, use if needed or wanted;

- CONDITIONS:
  - if there is only one line inside the condition:
    No curly braces needed;
    ```
    if (condition === value)
      doSomething();
    ```


  - if there is more than one line inside the condition:
    Write curly braces in a new line;
    ```
    if (condition === value)
    {
      doSomething();
      doSomethingElse();
    }
    ```

- COMPONENTS:
  - if the component/element only has one property:
  Write it in a single line;
  ```<div id='this-div'/>```

  - if the component/element has more than one property:
    Write one property per line;
    ```
    <div
      id='this-div'
      className='some-class'
      onClick={ handleOnClick }
    />
    ```
      
  - if component/element only has one child:
    Write it as a children={} property;
    ```
    <div
      id='this-div'
      className='some-class'
      onClick={ handleOnClick }
      children="Hey you! You're finally awake. You were trying to cross the border, right?"
    />

    <div
      id='this-div'
      className='some-class'
      onClick={ handleOnClick }
      children={ <Component item={ bla }/> }
    />
    ```

  - if component/element has component/element children (one or more):
    Write them in a new line;
    ```
    <div
      id='this-div'
      className='some-class'
      onClick={ handleOnClick }
    > 
      <div 
        className='user-info' 
        id='user-name'
        children={ user.name }
      /> 
      
      <div 
        className='user-info' 
        id='user-email'
      >
        <FontAwesomeIcon icon={ faMail }/>
        { user.email }
      </div>
    </div>
    ```
- METHODS
  - if there is only one short method applied to the variable:
  Write it all in a single line;
  ```
  const sortedData = data.sort((a, b) => { return a - b })
  ```

  - if there is more than one short method applied to the variable:
  Write them each in a new line;
  ```
  const sortedData = data
    .filter(dataItem => return dataItem.id !== unwantedData.id)
    .sort((a, b) => { return a - b })
  ```

  - if there is a long method applied to the variable:
  Open it up;
  ```
  const dataMapped = data.map(dataItem =>
  {
    if (dataItem.thing === 'thing)
      dataItem.otherThing = 'otherThing'

    if (dataItem.foo == 'bar')
    {
      dataItem.foo = 'bar'
      dataItem.bar = 'buzz'
    }

    return dataItem;
  })
  ```

  - if there is more than a long method applied to the variable:
  Write them separately or create a new variable if needed;
  ```
  const dataMapped = data.map(dataItem =>
  {
    if (dataItem.thing === 'thing)
      dataItem.otherThing = 'otherThing'

    if (dataItem.foo == 'bar')
    {
      dataItem.foo = 'bar'
      dataItem.bar = 'buzz'
    }

    return dataItem;
  })

  const dataSorted = dataMapped.sort((a, b) => 
  {
    if (sortMethod = 'pos-asc')
      return condition;

    if (sortMethod = 'pos-desc')
      return condition;

    else 
      return condition;
  })
  ```

- FUNCTIONS
  - Prefer the function syntax, instead of `const doThing = parameter => {  }`
  - If the function only has one line inside it:
  Write it all in a single line;
  ```
  function doSomething(parameter)
  { return parameter.something() }
  ```

  if the function has more than one line inside it:
  Write it normally;
  ```
  function doSomething(parameter0, items)
  {
    newParameter = parameter.something();
    
    for (let item in items)
    {
      doSomething(item);
      doSomethingElse(item);
    }

    return newParameter;
  }
  ```

- I'll add more formatting parameters as I go
