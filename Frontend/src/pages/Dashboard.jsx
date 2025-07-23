import React from 'react'

import { CourseData } from '../context/CourseContext'
import CourseCard from '../components/CourseCard';



const Dashboard = () => {

    const {mycourse} =CourseData();
    
  return (
    <div className='student-dashboard'>
        <h2>All Enrolled Courses</h2>
        <div className="dashboard-content">
            {mycourse && mycourse.length > 0 ? (
                mycourse.map((e) => <CourseCard key={e.id} course={e} />)
            ): (
                <p>No Courses Enrolled yet</p>
            )}
        </div>
    </div>
  )
}

export default Dashboard