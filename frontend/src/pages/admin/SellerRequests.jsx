
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/seller-requests/admin");

      setRequests(response.data?.requests || []);
    } catch (err) {
      console.error("SELLER REQUESTS ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Failed to load seller requests.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      const response = await api.put(
        `/seller-requests/${id}/approve`
      );

      toast.success(
        response.data?.message ||
          "Seller request approved successfully."
      );

      await fetchRequests();
    } catch (err) {
      console.error("APPROVE ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to approve seller request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      const response = await api.put(
        `/seller-requests/${id}/reject`
      );

      toast.success(
        response.data?.message ||
          "Seller request rejected successfully."
      );

      await fetchRequests();
    } catch (err) {
      console.error("REJECT ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to reject seller request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm font-medium text-gray-500">
          Loading seller requests...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Admin
          </p>

          <h1 className="mt-1 text-2xl font-black text-gray-900">
            Seller Requests
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and manage seller applications.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Requests
          </p>

          <p className="mt-2 text-2xl font-black text-gray-900">
            {requests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">
            Pending
          </p>

          <p className="mt-2 text-2xl font-black text-amber-700">
            {
              requests.filter(
                (request) => request.status === "pending"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">
            Approved
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-700">
            {
              requests.filter(
                (request) => request.status === "approved"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Empty */}

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="text-4xl">🏪</div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            No seller requests
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            New seller applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Applicant */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900">
                      {request.fullName}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-800">
                        {request.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {request.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Business
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {request.businessName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Category
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {request.businessCategory}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-400">
                      Reason for becoming a seller
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {request.reason}
                    </p>
                  </div>

                  {/* Date */}

                  <p className="mt-4 text-xs text-gray-400">
                    Submitted:{" "}
                    {request.createdAt
                      ? new Date(
                          request.createdAt
                        ).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                {/* Actions */}

                {request.status === "pending" && (
                  <div className="flex shrink-0 gap-3 lg:flex-col">
                    <button
                      onClick={() =>
                        handleApprove(request._id)
                      }
                      disabled={
                        actionLoading === request._id
                      }
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === request._id
                        ? "Processing..."
                        : "✓ Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleReject(request._id)
                      }
                      disabled={
                        actionLoading === request._id
                      }
                      className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerRequests;

