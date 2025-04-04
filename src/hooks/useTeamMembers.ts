import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TeamMember } from "@/types/Models";

export const useTeamMembers = () => {
  const queryClient = useQueryClient();

  const { data: teamMembers, ...teamMembersQuery } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      const { data } = await api.get("/team/all-team-members");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const createSingleTeamMember = useMutation({
    mutationFn: async (teamMemberData: TeamMember) => api.post(`/team/create-team-member`, teamMemberData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teamMembers"] }),
  })

  const { mutate: fetchSingleTeamMember, data: singleTeamMember } = useMutation({
    mutationFn: async (externalId: string) => {
      const { data } = await api.get(`/team/get-single-team-member?externalId=${externalId}`)
      return data;
    }
  })

  const updateSingleTeamMember = useMutation({
    mutationFn: async ({ externalId, teamMemberData }: { externalId: string; teamMemberData: TeamMember }) =>
      api.put(`/team/update-single-team-member?externalId=${externalId}`, teamMemberData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teamMembers"] }),
  })

  const deleteTeamMember = useMutation({
    mutationFn: async (id: string) => api.delete(`/team/delete-team-member?externalId=${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teamMembers"] }),
  });

  const uploadTeamMemberAvatar = useMutation({
    mutationFn: async ({ externalId, file }: { externalId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.put(`/team/upload-avatar?externalId=${externalId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teamMembers"] }),
  });

  return {
    teamMembers,
    teamMembersQuery,
    createSingleTeamMember,
    fetchSingleTeamMember,
    singleTeamMember,
    updateSingleTeamMember,
    deleteTeamMember,
    uploadTeamMemberAvatar
  };
};
