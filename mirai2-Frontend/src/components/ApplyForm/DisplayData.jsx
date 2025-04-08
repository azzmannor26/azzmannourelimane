import React, { useContext } from "react";
import { MultiStepContext } from "../../store/StepStore.jsx";

export default function DisplayData() {
  const { finalData } = useContext(MultiStepContext);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Submitted Data</h2>
      {finalData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Full Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th> {/* New email field */}
                <th className="border border-gray-300 px-4 py-2">Establishment</th>
                <th className="border border-gray-300 px-4 py-2">Degree</th>
                <th className="border border-gray-300 px-4 py-2">Internship Duration</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Internship Type</th>
              </tr>
            </thead>
            <tbody>
              {finalData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.fullname || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.email || "-"}</td> {/* Show email */}
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.establishment || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.degree || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.internshipDuration || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.department || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{data.internshipType || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No data submitted yet.</p>
      )}
    </div>
  );
}
