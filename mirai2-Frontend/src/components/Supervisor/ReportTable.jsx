import React from "react";
import ReportRow from "./ReportRow";

const ReportTable = ({ reports, onStatusChange }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left rounded-lg">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-gray-700">Intern's Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Report Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Manage</th>
                    {/* New column for “View” button only */}
                    <th className="p-4 text-sm font-semibold text-gray-700">Reports</th>
                </tr>
                </thead>
                <tbody>
                {reports.map((report) => (
                    <ReportRow
                        key={report.id}
                        report={report}
                        onStatusChange={onStatusChange}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
