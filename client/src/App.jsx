
import Add from "./Add";
import "./App.css";
import {Routes,Route} from 'react-router-dom'
import View from "./View";
import AddTags from "./AddTags";
import EditBlog from "./EditBlog";


function App() {
 


  return (
   <>
   <Routes>
    <Route path="/" element={<AddTags/>}/>
    <Route path="/add" element={<Add/>}/>
    <Route path="/view" element={<View/>}/>
    <Route path="/edit/:id" element={<EditBlog/>}/>
   </Routes>
   </>
  );
}

export default App;
