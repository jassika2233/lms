import React, { useState } from 'react'
import './adminc.css'
import Layout from '../Utils/Layout'
import { useNavigate } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/coursecard/CourseCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const categories =[
    "Web Development",
    "App Development",
    "Data Science",
    "Game Development",
    "Artificial Intelligence"
]

const AdminCourses = ({user}) => {
    const navigate= useNavigate()

    if(user && user.role!=="admin") return navigate("/");

    const {courses,fetchCourses} =CourseData()
    const [title,setTitle] =useState("")
    const [description,setDescription] =useState("")
    const [category,setCategory] =useState("")
    const [price,setPrice] =useState("")
    const [image,setImage] =useState("")
    const [duration,setDuration] = useState("")
    const [createdBy,setCreatedBy] = useState("");
    const [imagePrev,setImagePrev] =useState("")
    const [btnLoading,setBtnLoading] =useState(false)


    const changeImageHandler =e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file)

        reader.onloadend= () => {
            setImagePrev(reader.result)
            setImage(file)
        }
    }

    const submitHandler=async(e) =>{
        e.preventDefault()
        setBtnLoading(true)

        const myForm = new FormData()

        myForm.append("title",title)
        myForm.append("description",description)
        myForm.append("category",category)
        myForm.append("price",price)
        myForm.append("file",image)
        myForm.append("duration",duration)
        myForm.append("createdBy",createdBy)


        try {
            const {data} = await axios.post(`${server}/api/course/new`,myForm,{
                headers:{
                    token: localStorage.getItem("token"),
                },
            })

            toast.success(data.message)
            setBtnLoading(false)
            await fetchCourses()
            setTitle("")
            setDescription("")
            setCategory("")
            setPrice("")
            setImage("")
            setDuration("")
            setCreatedBy("");
            setImagePrev("")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
  return (
    <Layout>
        <div className="admin-courses">
            <div className="left">
                <h1>All Courses</h1>
                <div className="dashboard-content">
                    {
                        courses && courses.length > 0 ?( courses.map((e) =>{
                            return <CourseCard key={e._id} course={e}/>
                        })
                        ):(
                            <p>No Courses Yet!</p>
                        )
                    }
                </div>
            </div>

            <div className="right">
                <div className="add-course">
                    <div className="course-form">
                        <h2>Add Courses</h2>
                        <form onSubmit={submitHandler}>
                            <label htmlFor="text">Title</label>
                            <input
                                type="text" 
                                value={title} 
                                onChange={e=>setTitle(e.target.value)}  
                                required
                            />

                            <label htmlFor="text">Description</label>
                            <input
                                type="text" 
                                value={description} 
                                onChange={e=>setDescription(e.target.value)}  
                                required
                            />

                            <label htmlFor="text">Price</label>
                            <input
                                type="number" 
                                value={price} 
                                onChange={e=>setPrice(e.target.value)}  
                                required
                            />

                            <label htmlFor="text">CreatedBy</label>
                            <input
                                type="text" 
                                value={createdBy} 
                                onChange={e=>setCreatedBy(e.target.value)}  
                                required
                            />

                            <select value={category} onChange={e=>setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {
                                    categories.map((e,)=>(
                                        <option key={e} value={e}>{e}</option>
                                    ))
                                }
                            </select>

                            <label htmlFor="text">Duration</label>
                            <input
                                type="text" 
                                value={duration} 
                                onChange={e=>setDuration(e.target.value)}  
                                required
                            />

                            <input type="file" required onChange={changeImageHandler} />

                            {
                                imagePrev && <img src={imagePrev} alt="" width={300} />
                            }


                            <button type='submit' disabled={btnLoading} className='common-btn'>{btnLoading?"Please wait...": "Add"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default AdminCourses