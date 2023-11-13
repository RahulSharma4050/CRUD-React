import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Student() {
    const [student, setStudent] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => {
                if (typeof res.data === 'string') {
                    console.error("Error received from the server:", res.data);
                    setError("Error received from the server: " + res.data);
                    setStudent([]); // Clear the student data in case of an error

                } else if (Array.isArray(res.data)) {
                    setStudent(res.data);
                    setError(null);
                } else {
                    console.error("Data received from the server is not an array:", res.data);
                    setError("Data received from the server is not an array: " + JSON.stringify(res.data));
                }
            })
            .catch(err => {
                console.error("Error fetching data from the server:", err);
                setError("Failed to fetch data from the server");
            });
    }, []);

    const handleDelete = (id) => {
        if (id) {
            axios.delete(`http://localhost:8081/delete/${id}`)
                .then(res => {
                    console.log(res);
                    window.location.reload()
                    // Add logic to update the state or perform other actions after successful deletion
                })
                .catch(err => {
                    console.error("Error deleting student:", err);
                });
        } else {
            console.error("Error: Student id is undefined");
        }
    };
    
    

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <Link to="/create" className='btn btn-success'>Add +</Link>
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.Name}</td>
                                    <td>{data.email}</td>
                                    <td>
                                        <Link to={`update/${data.id}`} className="btn btn-primary">Update</Link>
                                        <button onClick={() => handleDelete(data.ID)} className="btn btn-danger ms-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Student;
