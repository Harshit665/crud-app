import "./App.css";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import { useState, useEffect } from "react";
import firebaseApp from "./lib/firebase-config";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore(firebaseApp);

function App() {
  const model = {
    employeeName: "",
    salary: "",
    joiningDate: "",
  };
  // defining the usestates
  const [employeeData, setEmployeeData] = useState(model);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // used to update the data means we need to show the data live so to prevent the page to reload again and again we used this usestate which is passw=ed in useeffect
  const [employee, setemployee] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const req = async () => {
      // we can not make the asynchronous function in useeffect so we need to make the function and then call it in useeffect
      const snapshot = await getDocs(collection(db, "employees")); // get the data from the database
      setIsEmpty(snapshot.empty); // if the data is empty then set the isempty to true
      let tmp = []; // to store the data
      snapshot.forEach((doc) => {
        // loop through the data and store it in the tmp array
        const document = doc.data(); //
        document.uid = doc.id;
        tmp.push(document); // we can not push the data directly in the state because it will not re-render the page so we need to push the data in the tmp array and then set the state with the tmp array
      });
      setemployee(tmp);
    };
    req();
  }, [isEmpty, isUpdated]);

  // handling the changes in the input fields
  const handleChange = (e) => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  // creating the employee
  const createEmployee = async (e) => {
    try {
      e.preventDefault();
      await addDoc(collection(db, "employees"), employeeData);
      setIsEmpty(false);
      setemployee([...employee, employeeData]);
      setIsUpdated(!isUpdated);
      new Swal({
        icon: "success",
        title: "Success",
        text: "Employee added successfully",
      });
    } catch (err) {
      new Swal({
        icon: "error",
        title: "failed",
        text: err.message,
      });
    } finally {
      setEmployeeData(model);
    }
  };

  // deleting the data
  const deleteEmployee = async (id) => {
    const ref = doc(db, "employees", id);
    await deleteDoc(ref);
    setIsUpdated(!isUpdated);
  };

  //editing the data
  const editEmployee = (item) => {
    console.log(item);
    setEdit(item);
    setEmployeeData(item);
  };

  //saving employee
  const saveEmployee = async (e)=>{
    e.preventDefault();
    const ref=doc(db , "employees", edit.uid);
    await updateDoc(ref, employeeData);
    setIsUpdated(!isUpdated);
    setEdit(null);
    setEmployeeData(model);
  }
  return (
    <>
      <div className="flex flex-col items-center gap-16 ">
        <h1 className="font-bold text-5xl">
          COdingOtt<span className="text-red-400"> CRUD</span>
        </h1>
        <div className="flex w-8/12 gap-16">
          <form className="space-y-6 w-full" onSubmit={edit ? saveEmployee : createEmployee}>
            <div className="flex flex-col">
              <label>Employee Name</label>
              <input
                required
                name="employeeName"
                className="p-3 rounded border border-gray-300"
                placeholder="Employee Name"
                onChange={handleChange}
                value={employeeData.employeeName}
              />
            </div>

            <div className="flex flex-col">
              <label>Salary</label>
              <input
                required
                type="number"
                name="salary"
                className="p-3 rounded border border-gray-300"
                placeholder="Employee Name"
                onChange={handleChange}
                value={employeeData.salary}
              />
            </div>

            <div className="flex flex-col">
              <label>Joining Date</label>
              <input
                required
                type="date"
                name="joiningDate"
                className="p-3 rounded border border-gray-300"
                onChange={handleChange}
                value={employeeData.joiningDate}
              />
            </div>

            {edit == null ? (
              <button className="bg-green-500 px-6 py-3 rounded text-white">
                Create
              </button>
            ) : (
              <button className="bg-rose-500 px-6 py-3 rounded text-white">
                Save
              </button>
            )}
          </form>
          <div>
            {isEmpty && (
              <div className="flex flex-col items-center">
                <i className="ri-u-disk-line text-3xl text-gray-500"></i>
                <h1 className="text-3xl font-semibold text-gray-500">Empty</h1>
              </div>
            )}
            <h1 className="text-2xl font-semibold">Employees</h1>
            <table className="w-[500px]">
              <thead>
                <tr className="bg-rose-400 text-white text-left">
                  <th className="py-2 pl-2">S/no.</th>
                  <th>Employee name</th>
                  <th>Salary</th>
                  <th>joining date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employee.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="pl-2 py-2">{index + 1}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.salary}</td>
                    <td>{item.joiningDate}</td>
                    <div className="space-x-2">
                      <button
                        className="w-8 h-8 bg-indigo-200 my-1 text-blue-900 rounded"
                        onClick={() => editEmployee(item)}
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        className="w-8 h-8 bg-red-500 my-1 text-white rounded"
                        onClick={() => deleteEmployee(item.uid)}
                      >
                        <i className="ri-delete-bin-6-line"></i>
                      </button>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
