import { apiFetch } from "@/api/api";


export const bulkRemove = async (endpoint, payload) => {
    return apiFetch(`${endpoint}/bulk-remove`, {
        method: 'DELETE',
        body: payload
    });
};

export const handleStaffOperation = async (endpoint, { programId, userId, role, isAssigned }) => {
    const method = isAssigned ? 'DELETE' : 'POST';
    const action = isAssigned ? '/remove' : '/assign';

    try {
        return apiFetch(`${endpoint}${action}`, {
            method: method,
            body: {
                programId,
                userId,
                role: role?.toLocaleUpperCase()
            }
        });
    } catch (e) {
    }
};

export const isAssigned = (user, program, selectedRole) => {
    return user?.assignedRoles[program.id]?.includes(selectedRole.toUpperCase());

}