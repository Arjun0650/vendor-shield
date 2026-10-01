import axios from "axios";

import {
  mockApprovals,
  mockAuditLogs,
} from "../mock/mockData";


/*
|--------------------------------------------------------------------------
| Vendor Shield API configuration
|--------------------------------------------------------------------------
|
| REAL BACKEND:
| - Dashboard
| - Vendor Directory
| - Vendor Details
| - Vendor DNA
| - Vendor Relationships
|
| MOCK FOR NOW:
| - Investigation
| - Approvals
| - Audit Logs
| - Frontend dataset upload flow
|
*/


const USE_MOCK_API = true;


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";


const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});


/*
|--------------------------------------------------------------------------
| Dashboard - REAL BACKEND
|--------------------------------------------------------------------------
*/

export async function getDashboard() {
  const response = await api.get(
    "/api/dashboard"
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Vendors - REAL BACKEND
|--------------------------------------------------------------------------
*/

export async function getVendors(
  params = {}
) {
  const response = await api.get(
    "/api/vendors",
    {
      params,
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Vendor details - REAL BACKEND
|--------------------------------------------------------------------------
*/

export async function getVendor(
  vendorId
) {
  const response = await api.get(
    `/api/vendors/${vendorId}`
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Vendor DNA - REAL BACKEND
|--------------------------------------------------------------------------
*/

export async function getVendorDNA(
  vendorId
) {
  const response = await api.get(
    `/api/vendors/${vendorId}/dna`
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Vendor relationships - REAL BACKEND
|--------------------------------------------------------------------------
*/

export async function getVendorRelationships(
  vendorId
) {
  const response = await api.get(
    `/api/vendors/${vendorId}/relationships`
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Investigation
|--------------------------------------------------------------------------
*/

export async function getInvestigation(
  vendorId
) {
  if (USE_MOCK_API) {
    await mockDelay();

    return getMockInvestigation(
      vendorId
    );
  }

  const response = await api.get(
    `/api/vendors/${vendorId}/investigation`
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Approvals
|--------------------------------------------------------------------------
*/

export async function getApprovals() {
  if (USE_MOCK_API) {
    await mockDelay();

    return mockApprovals;
  }

  const response = await api.get(
    "/api/approvals"
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Approval action
|--------------------------------------------------------------------------
*/

export async function takeApprovalAction(
  transactionId,
  action,
  note = ""
) {
  if (USE_MOCK_API) {
    await mockDelay();

    return {
      success: true,
      transactionId,
      action,
      note,

      message:
        `Transaction ${action.toLowerCase()} successfully.`,
    };
  }

  const response = await api.post(
    `/api/approvals/${transactionId}/action`,
    {
      action,
      note,
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Audit logs
|--------------------------------------------------------------------------
*/

export async function getAuditLogs() {
  if (USE_MOCK_API) {
    await mockDelay();

    return mockAuditLogs;
  }

  const response = await api.get(
    "/api/audit-logs"
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| CSV upload
|--------------------------------------------------------------------------
|
| Keep this mock for now.
|
| Your current backend /api/upload endpoint loads the CSV files
| that already exist in the backend data folder.
|
| It does not currently accept browser-uploaded multipart files.
|
*/

export async function uploadDatasets(
  files,
  onUploadProgress
) {
  if (USE_MOCK_API) {
    await mockDelay(800);

    return {
      success: true,

      message:
        "Datasets uploaded successfully.",

      files: files.map(
        (file) => ({
          name: file.name,
          size: file.size,
        })
      ),
    };
  }

  const formData =
    new FormData();

  files.forEach((file) => {
    formData.append(
      "files",
      file
    );
  });

  const response = await api.post(
    "/api/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress,
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function mockDelay(
  milliseconds = 350
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}


/*
|--------------------------------------------------------------------------
| Mock Investigation
|--------------------------------------------------------------------------
|
| This stays mock until we create the real investigation backend route.
|
*/

function getMockInvestigation(
  vendorId
) {
  return {
    vendorId,

    riskScore:
      88,

    riskLevel:
      "CRITICAL",

    signals: [
      {
        title:
          "Recent bank account change",

        severity:
          "HIGH",

        description:
          "Bank details changed shortly before a high-value payment.",
      },

      {
        title:
          "Shared bank relationship",

        severity:
          "HIGH",

        description:
          "The current bank account is also connected to another vendor.",
      },

      {
        title:
          "Shared GSTIN relationship",

        severity:
          "MEDIUM",

        description:
          "A matching GSTIN relationship was detected.",
      },
    ],

    exposure:
      870000,

    aiSummary:
      "The vendor shows multiple connected risk signals. The strongest evidence is the recent banking change combined with a high-value pending payment and shared banking identity.",

    recommendedAction:
      "HOLD",

    timeline: [
      {
        date:
          "20 Sep 2026",

        title:
          "₹8.7L payment initiated",

        type:
          "transaction",
      },

      {
        date:
          "18 Sep 2026",

        title:
          "Bank account changed",

        type:
          "change",
      },

      {
        date:
          "15 Sep 2026",

        title:
          "Vendor relationship detected",

        type:
          "relationship",
      },
    ],
  };
}


export default api;