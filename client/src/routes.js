
import All from "./components/Interviews/All"
import Create from "./components/Interviews/Create"
import Edit from "./components/Interviews/Edit"

const routes = [
  {
    path:"/",
    component:All
  },
  {
    path:"/create",
    component:Create
  },
  {
    path:"/edit/:id",
    component:Edit
  },
];

export default routes;
