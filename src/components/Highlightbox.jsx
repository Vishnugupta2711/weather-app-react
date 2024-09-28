import React from "react";


// Define the props type for the HighlightBox component


const HighlightBox = ({ title, value, Icon }) => {
  return (
    <div
      style={{
        backgroundColor: "#374151",
        color: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        width: "180px",
        height: "80px",
      }}
    >
      <div>
        <div style={{ fontSize: "18px" }}>{title}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Icon style={{ fontSize: "30px" }} />
          <p style={{ fontSize: "30px" }}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default HighlightBox;
