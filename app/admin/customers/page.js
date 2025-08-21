'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
const AdminCustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch("/api/admin/customers");
                const data = await res.json();
                if (data.success) {
                    setCustomers(data.customers);
                }
            } catch (error) {
                // console.error("Failed to fetch customers:", error);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
        const email = customer.email || '';
        return (
            fullName.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Customer Accounts</h1>

            <input
                type="text"
                placeholder="Search by name or email..."
                className="border rounded p-2 mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">#</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Joined On</th>
                            {/* Future Actions Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer, index) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <Link href={`/admin/customers/${customer._id}`}>{index + 1}</Link>
                                        </td>
                                    <td className="border p-2">

                                        <Link href={`/admin/customers/${customer._id}`}>
                                        {customer.firstName} {customer.lastName}
                                        </Link>
                                    </td>
                                    <td className="border p-2">{customer.email}</td>
                                    <td className="border p-2">{customer.phone}</td>
                                    <td className="border p-2">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AdminCustomersPage;
