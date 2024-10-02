import React, { useState } from "react";
import axios from "axios";

export default function Test() {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/test/submit",
        {
          text,
        }
      );

      alert("Data Submitted successfully");
      console.log("Response from backend", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="test">
      <input
        type="text"
        placeholder="fill here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
