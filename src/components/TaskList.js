import TaskForm from "./TaskForm"
import Task from "./Task"
import{useState,useEffect} from 'react'
import {toast} from "react-toastify"
import axios from  "axios"
import { URL } from "../App"

import loadingImage from "../assets/loader.gif"

const TaskList = () => {
    const[task,setTask]=useState([]);
    const[completed,setCompleted]=useState([]);
    const[isLoading,setIsLoading]=useState(false);
    const[taskId,setTaskId]=useState("")
    const[isEditing,setIsEditing]=useState(false);
    const [formData,setFormData]=useState({
        name:"",
        completed:false
    })
    const {name}=formData
    const handleInputChange=(e)=>{
        const {name,value}=e.target
        setFormData({...formData,name:value})
    }
    const createTask=async(e)=>{
        e.preventDefault();
        if(name === ""){
            return toast.error("Input field cannot be empty")
        }
         try {
            await axios.post(`${URL}/api/task`,formData);
            toast.success("Task added successfully")
            setFormData({...formData,name:""});
            getTasks();
            
         } catch (error) {
            toast.error(error.message)
            
         }

    }
    const getTasks=async()=>{
        try {
            setIsLoading(true);
            const {data}=await axios.get(`${URL}/api/task`)
            setTask(data);                                                  
            setIsLoading(false);
        } catch (error) {
            setIsLoading(true); 
            toast.error(error.message)
            setIsLoading(false);
            
        }

    }
    const deleteTask=async(id)=>{
        try {
            await axios.delete(`${URL}/api/task/${id}`)
            toast.success("Task got deleted")
            getTasks()

        } catch (error) {
            toast.error(error.message)
            
        }
    }
    useEffect(()=>{
        const cTask=task.filter((tasks)=>{
            return tasks.completed===true;
        })
        setCompleted(cTask);
    },[task])
    const getSingleTask=(task)=>{
        setFormData({name:task.name,completed:false});
        setTaskId(task._id)
        setIsEditing(true);

    }
    const updateTask=async(e)=>{
        e.preventDefault()
        if(name===""){
            return toast.error("Input field cannot be empty")
        }
        try{
       await axios.put(`${URL}/api/task/${taskId}`,formData);
       setFormData({...formData,name:""})
       setIsEditing(false);
       getTasks();
        }
        catch(error){
            toast.error(error.message)
        }

    }
    const setToComplete=async(tasks)=>{
        const newFormData={
            name:tasks.name,
            completed: true,
        }
        try {
            await axios.put(`${URL}/api/task/${tasks._id}`,newFormData);
            toast.success("Congrats!! You have completed a task");
            getTasks();
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    useEffect(()=>{
        getTasks();

    },[])
  return (
    <div>
    <h2>Task Manager</h2>
    <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
    {task.length>0 && ( <div className="--flex-between --pb">
        <p>
            <b>Total Tasks :</b>{task.length}
            </p>
            <p>
            <b>Completed Tasks :</b>{completed.length}
        
        </p>
    </div>)}
   
    <hr/>
    {
        isLoading && (<div className="--flex-center">
            <img src={loadingImage} alt='loading'/>
        </div>)
    }
    {
        !isLoading && task.length===0 ?(<p className="--py">Please add a task. No task added</p>):
        (<>
        {
            task.map((tasks,index)=>{
                return(
                    <Task  key={task._id} index={index} tasks={tasks} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>
                )
                
            }
            )
        }
        </>)
    }
  
    </div>
  )
}

export default TaskList
