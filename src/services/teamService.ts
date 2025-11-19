import api from './api';
import { TeamMember, TeamMembersResponse, MemberTasksResponse } from '../types';

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    const response = await api.get<TeamMembersResponse>('/team/members');
    return response.data.members;
  },

  async getMemberTasks(memberId: number | string): Promise<MemberTasksResponse> {
    const response = await api.get<MemberTasksResponse>(`/team/members/${memberId}/tasks`);
    return response.data;
  },
};

