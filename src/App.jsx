import React, { useState, useEffect } from 'react';
import './App.css'
import { ClockLoader } from "react-spinners";

function App() {
  const setCookie = (name, value, days) => {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	};

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const [salaryText, setSalaryText] = useState('');
  const [salary, setSalary] = useState(getCookie('salary'));
  const [moneyMade, setMoneyMade] = useState(-1);

  const isBefore9AM = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    return currentHour < 9; 
  };

  const isWeekday = (date = new Date()) => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  function getWorkdayPercentage() {
    const now = new Date();
  
    // Create Date objects for start (9 AM) and end (5 PM) of workday
    const workdayStart = new Date(now);
    workdayStart.setHours(9, 0, 0, 0);
    
    const workdayEnd = new Date(now);
    workdayEnd.setHours(17, 0, 0, 0);
    
    if (now < workdayStart) {
        return 0;
    }
    
    if (now > workdayEnd) {
        return 1;
    }

    const totalWorkdayMs = workdayEnd - workdayStart;
    const elapsedMs = now - workdayStart;
    
    const percentage = (elapsedMs / totalWorkdayMs);
    return Math.round(percentage * 100000) / 100000;
  }

  const onSalaryChange = (salaryValue) => {
    setCookie("salary", salaryValue, 30)
    setSalary(salaryValue);
  }

  const resetSalary = () => {
    setCookie("salary", null, 30)
    setSalary(null);
    salaryText(null);
  }

  useEffect(() => {
    if (salary != null && salary > 0) {
      const interval = setInterval(() => {
        const percentage = getWorkdayPercentage();
        const mondayMade = percentage * salary / (365 * 5 / 7);
        setMoneyMade(mondayMade.toFixed(2));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setMoneyMade(null);
    }
  }, [salary]);

  return (
    <div className="w-lg font-roboto p-5 bg-[#FBE9D0]">
        {moneyMade == -1 ? <div className="flex justify-around">
            <ClockLoader />
          </div> : 
          <div>
            {moneyMade == null ? <div className="text-xl">
              <div className="mb-5">Hey! Feeling a bit unmotived? Here is a stupid little extension to help with that.</div>
              <div className="flex items-center">
                <label htmlFor="salary" className="mr-2">Enter your yearly salary: </label>
                <input
                    type="number"
                    id="salary"
                    value={salaryText}
                    onChange={(e) => setSalaryText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onSalaryChange(salaryText);
                      }
                    }}
                    className="border-1 p-px mr-2"
                />
                <button
                  onClick={() => onSalaryChange(salaryText)}
                  className="border-1 p-px pl-2 pr-2 cursor-pointer"
                >
                  Enter
                </button>
              </div>
            </div> : 
            <div>
              {isWeekday() ? 
              <div>
                {isBefore9AM() ? 
                  <div className="text-xl mb-2">It's before working hours, but you'll make <span className="text-[#90AEAD] font-extrabold">${(salary / 365).toFixed(2)}</span> today by just showing up.</div> :
                  <div className="text-xl mb-2">You've made <span className="text-[#90AEAD] font-extrabold">${moneyMade}</span> today by just showing up.</div>
                }
                <button onClick={() => resetSalary()} className="text-md border-1 p-px pl-2 pr-2 mb-2 cursor-pointer">Reset salary</button>
                <div className="text-md ">Note: This number is calculated based on your percentage of the way through a 9-5 work day.</div>
              </div> : 
              <div>
                <div className="text-xl mb-2">It's a weekend, but you made <span className="text-[#90AEAD] font-extrabold">${(salary / 52).toFixed(2)}</span> this week by just showing up.</div>
                <button onClick={() => resetSalary()} className="text-md border-1 p-px pl-2 pr-2 mb-2 cursor-pointer">Reset salary</button>
              </div>}
            </div>}
        </div>}
    </div>
  );
}

export default App; 
