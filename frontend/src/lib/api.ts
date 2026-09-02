const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getHeaders(token?: string, isJson = true) {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function fetchMyCases(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/cases/my-cases`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch cases');
  }
  return res.json();
}

export async function createCase(formData: FormData, token: string) {
  // Note: For FormData uploads, the browser must set the boundary header automatically.
  // Therefore, do NOT set Content-Type manually.
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`
  };
  const res = await fetch(`${API_BASE_URL}/cases`, {
    method: 'POST',
    headers,
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to report case');
  }
  return res.json();
}

export async function fetchMyRequests(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/assistance-requests/my-requests`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch assistance requests');
  }
  return res.json();
}

export async function createAssistanceRequest(data: any, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/assistance-requests`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit assistance request');
  }
  return res.json();
}

export async function fetchMyDonations(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/donations/my-donations`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch donations history');
  }
  return res.json();
}

// ---- Volunteer Module ----

export async function fetchAvailableCases(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/volunteer/available-cases`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch available cases');
  }
  return res.json();
}

export async function acceptCase(caseId: string, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/volunteer/accept-case`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ case_id: caseId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to accept case');
  }
  return res.json();
}

export async function fetchMyAssignments(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/volunteer/my-assignments`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch assignments');
  }
  return res.json();
}

export async function updateAssignment(assignmentId: string, data: { status: string; notes?: string }, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/volunteer/update-assignment/${assignmentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update assignment');
  }
  return res.json();
}

// ---- Campaigns & Donations ----

export async function fetchCampaigns() {
  const res = await fetch(`${API_BASE_URL}/campaigns`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch campaigns');
  }
  return res.json();
}

export async function createDonation(data: any, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/donations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create donation');
  }
  return res.json();
}

// ---- Admin Module ----

export async function fetchAdminStats(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch admin stats');
  }
  return res.json();
}

export async function fetchAllUsers(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/admin/users`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch users');
  }
  return res.json();
}

export async function updateUserRole(userId: string, role: string, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ role })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update role');
  }
  return res.json();
}

export async function fetchAllCases(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/admin/cases`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch cases');
  }
  return res.json();
}

export async function updateCaseStatus(caseId: string, status: string, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/admin/cases/${caseId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update case status');
  }
  return res.json();
}

export async function fetchAllDonations(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/admin/donations`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch donations');
  }
  return res.json();
}

export async function createCampaign(data: { title: string; description: string; target_amount: number }, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/admin/campaigns`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create campaign');
  }
  return res.json();
}

export async function updateCampaign(campaignId: string, data: any, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update campaign');
  }
  return res.json();
}

export async function fetchAdminRequests(token: string) {
  const headers = await getHeaders(token);
  const res = await fetch(`${API_BASE_URL}/admin/requests`, { headers });
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function updateAdminRequestStatus(reqId: string, status: string, token: string) {
  const headers = await getHeaders(token, true);
  const res = await fetch(`${API_BASE_URL}/admin/requests/${reqId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
