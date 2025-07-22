// "use client";

// import { useEffect, useState } from "react";
// import { Bar, Doughnut } from "react-chartjs-2";

// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   ArcElement,
// } from "chart.js";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBox,
//   faFolder,
//   faBriefcase,
//   faUsers,
//   faArrowUp,
//   faChevronRight,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";


// import { getRecentSales } from "@/utils/payment";

// ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement);

// export default function Dashboard() {
//   const [barData, setBarData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   const [doughnutData, setDoughnutData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   const [recentSales, setRecentSales] = useState([]);

//   useEffect(() => {
//     const fetchRecentSales = async () => {
//       const sales = await getRecentSales();
//       setRecentSales(sales);
//     };

//     fetchRecentSales();
//   }, []);


//   useEffect(() => {
//     setBarData({
//       labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//       datasets: [
//         {
//           label: "This Week",
//           data: [1000, 2200, 1800, 2000, 2100, 2500, 1400],
//           backgroundColor: "#000",
//         },
//         {
//           label: "Last Week",
//           data: [1200, 2000, 1700, 2300, 1800, 2400, 1600],
//           backgroundColor: "#ccc",
//         },
//       ],
//     });

//     setDoughnutData({
//       labels: ["Desktop", "Tablet", "Mobile"],
//       datasets: [
//         {
//           data: [30000, 10000, 26400],
//           backgroundColor: ["#2563EB", "#EA580C", "#16A34A"],
//         },
//       ],
//     });
//   }, []);

//   const stats = [
//     {
//       icon: (
//         <FontAwesomeIcon icon={faBox} size="2x" className="text-red-600 mr-1" />
//       ),
//       label: "Total Income",
//       value: "$50,000",
//       change: "+2.1%",
//     },
//     {
//       icon: (
//         <FontAwesomeIcon
//           icon={faFolder}
//           size="2x"
//           className="text-green-600 mr-1"
//         />
//       ),
//       label: "Gross Revenue",
//       value: "$50,000",
//       change: "-1.2%",
//     },
//     {
//       icon: (
//         <FontAwesomeIcon
//           icon={faBriefcase}
//           size="2x"
//           className="text-blue-600 mr-1"
//         />
//       ),
//       label: "Total Orders",
//       value: "13,000",
//       change: "+3.3%",
//     },
//     {
//       icon: (
//         <FontAwesomeIcon
//           icon={faUsers}
//           size="2x"
//           className="text-yellow-600 mr-1"
//         />
//       ),
//       label: "Total Customers",
//       value: "40,000",
//       change: "+2.4%",
//     },
//   ];

//   const transactions = [
//     {
//       name: "Bernie Green",
//       action: "bought a book",
//       date: "Apr 23, 2025",
//       amount: "$2300",
//       status: "Completed",
//     },
//     {
//       name: "Adebayo Adisa",
//       action: "bought a book",
//       date: "Apr 23, 2025",
//       amount: "-$670",
//       status: "Completed",
//     },
//     {
//       name: "Olufemi Bayo",
//       action: "returned a book",
//       date: "Apr 18, 2025",
//       amount: "$234",
//       status: "Cancelled",
//     },
//     {
//       name: "Nifemi Gbankle",
//       action: "bought a book",
//       date: "Apr 15, 2025",
//       amount: "$5000",
//       status: "In progress",
//     },
//   ];

//   return (
//     // <div className="flex bg-gray-100 min-h-screen lg:ml-64 lg:mt-16">
//     //   <main className="flex-1 p-6">
//     //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//     //       {stats.map((stat, idx) => (
//     //         <div
//     //           key={idx}
//     //           className="bg-white p-4 rounded shadow flex items-center"
//     //         >
//     //           <p>{stat.icon}</p>
//     //           <div className="text-gray-500 lg:flex-1  flex flex-col items-center">
//     //             <p>{stat.label}</p>{" "}
//     //             <p className="text-xl font-bold">{stat.value}</p>
//     //             <p
//     //               className={`text-sm ${stat.change.startsWith("-") ? "text-red-500" : "text-green-500"}`}
//     //             >
//     //               {stat.change} last month
//     //             </p>
//     //           </div>
//     //         </div>
//     //       ))}
//     //     </div>

//     //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//     //       <div className="bg-white pt-8 p-4 rounded shadow">
//     //         <div>
//     //           <div className="flex justify-between border-0 border-b-2 border-b-gray-600 pb-4">
//     //             <div className="flex ">
//     //               <FontAwesomeIcon
//     //                 icon={faUsers}
//     //                 size="2x"
//     //                 className="text-gray-600 bg-slate-200 rounded-md px-4 py-3 mr-4"
//     //               />

//     //               <div>
//     //                 <h3 className="text-2xl text-gray-900 font-bold">3.4k</h3>{" "}
//     //                 <p>New reader this week</p>
//     //               </div>
//     //             </div>
//     //             <div className="flex justify-center items-center w-16 h-8 text-green-600 bg-green-300 rounded-md p-[3px]">
//     //               <FontAwesomeIcon
//     //                 icon={faArrowUp}
//     //                 className="text-green-600 mr-1"
//     //               />

//     //               <p className="">24%</p>
//     //             </div>
//     //           </div>
//     //           <div className="flex justify-between mt-3">
//     //             <p className="text-sm">
//     //               Money earned:{" "}
//     //               <span className="text-base font-bold">$3,232</span>
//     //             </p>
//     //             <p className="text-sm">
//     //               Conversion rate:{" "}
//     //               <span className="text-base font-bold">1.2%</span>
//     //             </p>
//     //           </div>
//     //         </div>
//     //         <div className="mt-9">
//     //           {barData.datasets.length > 0 && <Bar data={barData} />}
//     //         </div>
//     //         <div className="flex justify-between mt-9 mx-2 pt-3 border-0 border-t-2 border-gray-400">
//     //           <div className="flex items-center">
//     //             <p className="mr-1">Last 7 days</p>
//     //             <FontAwesomeIcon
//     //               icon={faChevronDown}
//     //               className="text-gray-600 mr-1"
//     //             />
//     //           </div>
//     //           <div className="flex items-center">
//     //             <p className="mr-1">USERS REPORT</p>
//     //             <FontAwesomeIcon
//     //               icon={faChevronRight}
//     //               className="text-gray-600 mr-1"
//     //             />
//     //           </div>
//     //         </div>
//     //       </div>

//     //       <div className="bg-white p-4 rounded shadow">
//     //         {doughnutData.datasets.length > 0 && (
//     //           <Doughnut data={doughnutData} />
//     //         )}
//     //         <div className="text-center mt-4 text-xl">66.4k Unique Readers</div>
//     //         <div className="flex items-center justify-center gap-4">
//     //           <div className="flex items-center gap-2">
//     //             <div className="w-4 h-4 rounded-full bg-blue-600" />
//     //             <p>Desktop</p>
//     //           </div>
//     //           <div className="flex items-center gap-2">
//     //             <div className="w-4 h-4 rounded-full bg-green-600" />
//     //             <p>Tablet</p>
//     //           </div>
//     //           <div className="flex items-center gap-2">
//     //             <div className="w-4 h-4 rounded-full bg-orange-600" />
//     //             <p>Mobile</p>
//     //           </div>
//     //         </div>

//     //         <div className="flex justify-between mt-9 mx-2 pt-3 border-0 border-t-2 border-gray-400">
//     //           <div className="flex items-center">
//     //             <p className="mr-1">Last 7 days</p>
//     //             <FontAwesomeIcon
//     //               icon={faChevronDown}
//     //               className="text-gray-600 mr-1"
//     //             />
//     //           </div>
//     //           <div className="flex items-center">
//     //             <p className="mr-1">USERS REPORT</p>
//     //             <FontAwesomeIcon
//     //               icon={faChevronRight}
//     //               className="text-gray-600 mr-1"
//     //             />
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     <div className="bg-white p-4 rounded shadow">
//     //       <h2 className="mb-4 text-lg font-semibold">Latest Transactions</h2>
//     //       <table className="w-full text-left">
//     //         <thead>
//     //           <tr>
//     //             <th className="pb-2">Transaction</th>
//     //             <th className="pb-2">Date & Time</th>
//     //             <th className="pb-2">Amount</th>
//     //             <th className="pb-2">Status</th>
//     //           </tr>
//     //         </thead>
//     //         <tbody>
//     //           {transactions.map((tx, idx) => (
//     //             <tr key={idx} className="border-t">
//     //               <td className="py-2">
//     //                 {tx.name} {tx.action}
//     //               </td>
//     //               <td className="py-2">{tx.date}</td>
//     //               <td className="py-2">{tx.amount}</td>
//     //               <td
//     //                 className={`py-2 ${tx.status === "Cancelled" ? "text-red-500" : "text-green-600"}`}
//     //               >
//     //                 {tx.status}
//     //               </td>
//     //             </tr>
//     //           ))}
//     //         </tbody>
//     //       </table>
//     //     </div>
//     //   </main>
//     // </div>
//     <section className="mt-10 w-full max-w-md lg:ml-72 lg:mt-20">
//       <h3 className="mb-4 text-lg font-semibold">Recent Sales</h3>
//       {recentSales.length === 0 ? (
//         <p className="text-sm text-gray-500">No recent sales found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {recentSales.map((sale) => (
//             <li
//               key={sale.id}
//               className="rounded-md border border-gray-200 p-4 shadow-sm"
//             >
//               <div className="flex justify-between">
//                 <p className="font-medium">{sale.book_title}</p>
//                 <p className="font-bold text-green-600">
//                   ${parseFloat(sale.amount).toFixed(2)}
//                 </p>
//               </div>
//               <div className="mt-1 text-sm text-gray-500">
//                 <span className="capitalize">{sale.content_type}</span> •{" "}
//                 {new Date(sale.purchase_date).toLocaleString()} •{" "}
//                 <span className="text-green-700">{sale.status}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getRecentSales } from "@/utils/payment";
import formatDateTime from "@/utils/formatDate"; // You can create this helper

const EarningsTable = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const result = await getRecentSales();
      setSales(result);
    };

    fetchSales();
  }, []);

  return (
    <div className="overflow-x-auto w-full max-w-[850px] relative mt-20 ml-72">
      <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>

      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700 rounded-lg">
              <TableHead className="text-white">Book Title</TableHead>
              <TableHead className="text-white">Amount ($)</TableHead>
              <TableHead className="text-white">Content Type</TableHead>
              <TableHead className="text-white">Purchase Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>

            {/* Filter Icon Row */}
            <TableRow className="hover:bg-white">
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {sales?.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.book_title}
                  </TableCell>
                  <TableCell className="text-green-700 font-semibold">
                    {parseFloat(sale.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {sale.content_type}
                  </TableCell>
                  <TableCell>{formatDateTime(sale.purchase_date)}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        sale.status === "approved"
                          ? "text-green-600"
                          : "text-gray-600"
                      } font-medium`}
                    >
                      {sale.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500">
                  No recent sales available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EarningsTable;
