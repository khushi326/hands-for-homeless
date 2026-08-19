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

