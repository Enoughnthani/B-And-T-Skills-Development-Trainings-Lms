import { apiFetch } from "@/api/api";
import { ENROLLMENT } from '@/utils/apiEndpoint';



export const enrollLearner = async (learner, programId) => {
    const method = learner?.enrolled ? 'DELETE' : 'POST';
    const endpoint = learner?.enrolled ? '/remove' : '/enroll';
    
    return apiFetch(`${ENROLLMENT}${endpoint}`, {
        method: method,
        body: {
            programId: programId,
            userId: learner.id,
        }
    });
};

export const bulkRemoveEnrollment = async (programId, userIds) => {
    return apiFetch(`${ENROLLMENT}/bulk/remove`, {
        method: 'DELETE',
        body: {
            programId: programId,
            userIds: userIds
        }
    });
};