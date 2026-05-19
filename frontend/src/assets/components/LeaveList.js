const LeaveList = ({ leaves, loading }) => {
    if (loading) return <p>Loading...</p>;
  
    if (!leaves.length) return <p>No leave records found.</p>;
  
    return (
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.startDate} → {leave.endDate} | Status: {leave.status}
          </li>
        ))}
      </ul>
    );
  };
  
  export default LeaveList;