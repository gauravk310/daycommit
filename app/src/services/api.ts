const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    count?: number;
    message?: string;
}

class ApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: this.getHeaders(),
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Entry endpoints
    async getEntries() {
        return this.request('/entries');
    }

    async getEntryByDate(date: string) {
        return this.request(`/entries/${date}`);
    }

    async createEntry(entryData: {
        date: string;
        status: string;
        description: string;
        achievement: string;
        duration?: number;
    }) {
        return this.request('/entries', {
            method: 'POST',
            body: JSON.stringify(entryData),
        });
    }

    async updateEntry(
        id: string,
        updates: {
            status?: string;
            description?: string;
            achievement?: string;
            duration?: number;
        }
    ) {
        return this.request(`/entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteEntry(id: string) {
        return this.request(`/entries/${id}`, {
            method: 'DELETE',
        });
    }

    async getUserStats() {
        return this.request('/entries/stats');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

export const apiService = new ApiService();
