import React from 'react'
import "./Docdashboard.css";
import { FaUserInjured } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import {Chart as ChartJS,ArcElement,Tooltip,Legend,} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FaSquare } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { RiFileList2Line } from "react-icons/ri";
import { BiSolidDashboard } from "react-icons/bi";



ChartJS.register(ArcElement, Tooltip, Legend);


const Docdashboard = () => {

  const [value, setValue] = useState(new Date());

const data = {
  labels: ["New Patient", "Old Patience", "Total Patient"],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: [
        "#2563eb",
        "#c9d5fb",
        "#f59e0b",
      ],
      borderWidth: 0,
      cutout: "45%",
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

  const appointments = [
    {
      name: "John Deo",
      problem: "Fever Checkup",
      time: "10:00 AM",
    },
    {
      name: "Maria Sara",
      problem: "Skin Allergy",
      time: "11:30 AM",
    },
    {
      name: "Robert Alex",
      problem: "Diabetes",
      time: "01:00 PM",
    },
    {
      name: "Jennifer Roy",
      problem: "Heart Checkup",
      time: "03:30 PM",
    },  
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="doctor-profile">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="doctor"
            className="doctor-image"
          />
          <h2>Dr. Martin Deo</h2>
          <p>Cardiologist</p>
        </div>

        <div className="menu">

  <button className="menu-btn active-menu">
    <BiSolidDashboard className="menu-icon" />
    Dashboard
  </button>

 <button className="menu-btn">
    <RiFileList2Line className="menu-icon" />
    Appointment
  </button>

  <button className="menu-btn">
    <IoSettingsSharp className="menu-icon" />
    Settings
  </button>

  <button className="menu-btn logout-btn">
    <TbLogout className="menu-icon" />
    Logout
  </button>

</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-cards">
        <div className="card">
  <div className="card-icon">
    <FaUserInjured />
  </div>

  <div>
    <h3>Total Patients</h3>
    <h1>2000+</h1>
    <p>Till Today</p>
  </div>
</div>

         <div className="card">
  <div className="card-icon">
    <MdHealthAndSafety />
  </div>

  <div>
    <h3>Total Appointment</h3>
    <h1>50</h1>
    {new Date().toDateString()}
  </div>
</div>

          <div className="card">
  <div className="card-icon">
    < FaUserMd />
  </div>

  <div>
    <h3>Today's Patient</h3>
    <h1>20</h1>
    {new Date().toDateString()}
  </div>
</div>
</div>
        <div className="content-grid">
          {/* Appointment List */}
          <div className="appointment-section">
            <h2>Today's Appointments</h2>

            {appointments.map((item, index) => (
              <div className="appointment-card" key={index}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.problem}</p>
                </div>

                <span>{item.time}</span>
              </div>
            ))}
          </div>


          {/* Doughnut Chart */}

    <div className="summary-box">
      <h2>Patients Summary</h2>

      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>

      <div className="summary-list">

        <div className="summary-row">
          <div className="summary-left">
            <span className="dot excellent-dot"></span>
            <p className='m50'><span className='col-or'><FaSquare /></span> New Patient</p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-left">
            <span className="dot good-dot"></span>
            <p className='m10'><span className='co-lor'><FaSquare /></span> Old Patient</p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-left">
            <span className="dot average-dot"></span>
            <p className='m10'><span className='colo-r'><FaSquare /></span> Total Patient</p>
          </div>
        </div>

      </div>
    </div>

          {/* Right Side */}
          <div className="right-section">



            {/* Calendar */}
           <div className="calendar-box">
  <h2>Calendar</h2>

  <div className="calendar-wrapper">
    <Calendar onChange={setValue} value={value} />
  </div>
</div>
</div>

{/* Reviews */}
            <div className="review-box">
              <h2>Patient Reviews</h2>

              <div className="review-item">
                <span>Excellent</span>
                <div className="progress">
                  <div className="progress-fill excellent"></div>
                </div>
              </div>

              <div className="review-item">
                <span>Good</span>
                <div className="progress">
                  <div className="progress-fill good"></div>
                </div>
              </div>

              <div className="review-item">
                <span>Average</span>
                <div className="progress">
                  <div className="progress-fill average"></div>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default Docdashboard;