import { useEffect, useState } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LeaveList from "../components/LeaveList";
import axios from "axios";

const LeaveRequestPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const endpoint = role === "admin" ? "/api/leaves" : "/api/leaves/my";
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaves(res.data.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div>
      <h2>Request Leave</h2>
      <LeaveRequestForm onSuccess={fetchLeaves} />

      <h2>My Leaves</h2>
      <LeaveList leaves={leaves} loading={loading} />
    </div>
  );
};

export default LeaveRequestPage;
