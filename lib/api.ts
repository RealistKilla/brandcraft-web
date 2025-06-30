interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  errors?: any[];
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
}

export const api = {
  auth: {
    signUp: (data: { 
      name: string; 
      email: string; 
      password: string;
      accountType: string;
      organizationName?: string;
      existingOrganization?: string;
    }) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    signIn: (data: { email: string; password: string }) =>
      apiRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    signOut: () =>
      apiRequest('/auth/signout', {
        method: 'POST',
      }),
    
    getUser: () => apiRequest('/auth/me'),
  },
  applications: {
    getAll: () => apiRequest('/applications'),
    create: (data: { name: string }) =>
      apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  analytics: {
    getData: (applicationId: string) => 
      apiRequest(`/analytics?applicationId=${applicationId}`),
  },
};

export { ApiError };