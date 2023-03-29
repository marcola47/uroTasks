import { v4 } from 'uuid';

const projects = 
[
  {
    id: v4(), 
    active: true,  
    name: "PET",             
    color: "#ff4d4d", 
    todo:  [{id: v4(), text: "pet"}, {id: v4(), text: "todo"}], 
    doing: [{id: v4(), text: "pet"}, {id: v4(), text: "doing"}], 
    done:  [{id: v4(), text: "pet"}, {id: v4(), text: "done"}]
  },
  
  {
    id: v4(), 
    active: true,  
    name: "WORK",             
    color: "#189AD1", 
    todo:  [{id: v4(), text: "work"}, {id: v4(), text: "todo"}], 
    doing: [{id: v4(), text: "work"}, {id: v4(), text: "doing"}], 
    done:  [{id: v4(), text: "work"}, {id: v4(), text: "done"}]
  },

  {
    id: v4(), 
    active: true,  
    name: "COLLEGE",             
    color: "#00ff94", 
    todo:  [{id: v4(), text: "college"}, {id: v4(), text: "todo"}], 
    doing: [{id: v4(), text: "college"}, {id: v4(), text: "doing"}], 
    done:  [{id: v4(), text: "college"}, {id: v4(), text: "done"}]
  },

  {
    id: v4(), 
    active: true,  
    name: "ONLINE BUSINESS",             
    color: "#a269ff", 
    todo:  [{id: v4(), text: "online business"}, {id: v4(), text: "todo"}], 
    doing: [{id: v4(), text: "online business"}, {id: v4(), text: "doing"}], 
    done:  [{id: v4(), text: "online business"}, {id: v4(), text: "done"}]
  }
];

export default projects;