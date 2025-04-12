import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false); // 🔘 Toggle shortlisted

  // 📦 Fetch Applications
  useEffect(() => {
    axios.get("http://localhost:5000/api/applications").then((res) => {
      setApplications(
        res.data.map((app) => ({
          ...app,
          shortlisted: app.shortlisted || false, // default for frontend
        }))
      );
    });
  }, []);


  // ✅ Skill List
  const uniqueSkills = [
    ...new Set(
      applications
        .flatMap((app) =>
          app.skills?.split(",").map((s) => s.trim().toLowerCase())
        )
    ),
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // ✅ Filter logic
  let filteredApplications = applications.filter((app) => {
    const name = app.fullName?.toLowerCase() || "";
    const email = app.email?.toLowerCase() || "";
    const skills = app.skills?.toLowerCase() || "";
    const matched = app.matchedSkills?.join(" ").toLowerCase() || "";

    const searchMatch =
      name.includes(searchQuery) ||
      email.includes(searchQuery) ||
      skills.includes(searchQuery) ||
      matched.includes(searchQuery);

    const skillMatch =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) =>
        app.skills.toLowerCase().includes(skill.toLowerCase())
      );

    const shortlistMatch = !showShortlistedOnly || app.shortlisted;

    return searchMatch && skillMatch && shortlistMatch;
  });

  // 📊 Sort logic
  if (sortType) {
    filteredApplications.sort((a, b) => {
      const valA = a[sortType] || 0;
      const valB = b[sortType] || 0;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }

  // 🔘 Get shortlisted list separately
  const shortlistedApplications = applications.filter((app) => app.shortlisted);

  // 🧾 Excel Export
  const exportToExcel = (data) => {
    const dataToExport = data.map((app) => ({
      Name: app.fullName,
      Email: app.email,
      Phone: app.phone,
      Skills: app.skills,
      Experience: app.experience,
      Education: app.education,
      MatchScore: app.matchScore,
      Shortlisted: app.shortlisted ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "JobApplications.xlsx");
  };

  // 🧾 PDF Export
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    const tableData = data.map((app) => [
      app.fullName,
      app.email,
      app.phone,
      app.skills,
      `${app.experience} years`,
      `${app.matchScore}%`,
      app.education,
      app.shortlisted ? "Yes" : "No",
    ]);

    doc.autoTable({
      head: [
        [
          "Full Name",
          "Email",
          "Phone",
          "Skills",
          "Experience",
          "Match Score",
          "Education",
          "Shortlisted",
        ],
      ],
      body: tableData,
    });

    doc.save("JobApplications.pdf");
  };

  // 🎯 Handle Shortlist
  const handleShortlist = async (index) => {
    const selectedApp = applications[index];

    try {
      const res = await axios.put(
        `http://localhost:5000/api/applications/shortlist/${selectedApp._id}`,
        { shortlisted: true }
      );

      const updatedApplications = [...applications];
      updatedApplications[index] = res.data;
      setApplications(updatedApplications);
    } catch (err) {
      console.error("Error shortlisting:", err);
      alert("Failed to shortlist this applicant");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Job Applications</h2>

      {/* 🧾 Download Buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => exportToExcel(filteredApplications)}>📥 Excel (Filtered)</button>
        <button onClick={() => exportToPDF(filteredApplications)}>📄 PDF (Filtered)</button>
        <button onClick={() => exportToExcel(shortlistedApplications)}>📥 Excel (Shortlisted)</button>
        <button onClick={() => exportToPDF(shortlistedApplications)}>📄 PDF (Shortlisted)</button>
      </div>

      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <>
          {/* ✅ Skill Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            <strong>Filter by Skills:</strong>
            {uniqueSkills.map((skill, index) => (
              <label
                key={index}
                style={{
                  backgroundColor: selectedSkills.includes(skill)
                    ? "#4ade80"
                    : "#e5e7eb",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  value={skill}
                  checked={selectedSkills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                  style={{ marginRight: "5px" }}
                />
                {skill}
              </label>
            ))}
          </div>

          {/* 🔍 Search */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              style={{
                padding: "8px",
                width: "300px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* ⬆️ Sort */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px" }}>Sort By:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="">None</option>
              <option value="matchScore">Match Score</option>
              <option value="experience">Experience</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>

          {/* 🔘 Toggle Shortlisted Only */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={showShortlistedOnly}
                onChange={(e) => setShowShortlistedOnly(e.target.checked)}
              />
              Show only shortlisted
            </label>
          </div>

          {/* 📋 Applications Table */}
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>MatchScore</th>
                <th>Education</th>
                <th>Resume</th>
                <th>Shortlist</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app, index) => (
                <tr key={index}>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>

                  {/* 🔍 Highlight matched skills */}
                  <td>
                    {app.skills?.split(",").map((skill, i) => {
                      const trimmedSkill = skill.trim().toLowerCase();
                      const isMatched =
                        app.matchedSkills &&
                        app.matchedSkills
                          .map((s) => s.toLowerCase())
                          .includes(trimmedSkill);

                      return (
                        <span
                          key={i}
                          style={{
                            backgroundColor: isMatched ? "#d1fae5" : "#e5e7eb",
                            color: isMatched ? "#065f46" : "#374151",
                            padding: "3px 6px",
                            borderRadius: "5px",
                            marginRight: "5px",
                            fontSize: "12px",
                            display: "inline-block",
                          }}
                        >
                          {skill.trim()}
                        </span>
                      );
                    })}
                  </td>

                  {/* 📊 Match Score */}
                  <td>
                    <div
                      style={{
                        width: "100px",
                        background: "#eee",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${app.matchScore}%`,
                          background:
                            app.matchScore >= 70 ? "#34d399" : "#facc15",
                          padding: "4px",
                          fontSize: "12px",
                          textAlign: "center",
                          color: "#111",
                        }}
                      >
                        {app.matchScore}%
                      </div>
                    </div>
                  </td>

                  <td>{app.experience} years</td>
                  <td>{app.education}</td>

                  {/* 📄 Resume */}
                  <td>
                    <a
                      href={`http://localhost:5000/${app.resumePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                    <a
  href={`http://localhost:5000/${app.resumePath}`}
  download
  className="text-blue-600 underline"
>
  Download
</a>

                  </td>

                  {/* 🎯 Shortlist Button */}
                  <td>
                    {app.shortlisted ? (
                      <span className="text-green-600 font-semibold">
                        Shortlisted ✅
                      </span>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleShortlist(index)}
                      >
                        Shortlist
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AllApplications;
