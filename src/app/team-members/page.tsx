'use client';
import { useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { TeamMember } from '@/types/Models';
import Modal from '@/components/UI/Modal';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';
import Link from 'next/link';
import NewTeamMemberForm from '@/components/Forms/NewTeamMemberForm';
import TeamMemberCard from '@/components/Cards/TeamMemberCard';

export default function TeamMembersPage() {
  const {
    teamMembers,
    teamMembersQuery: {
      isLoading: teamMembersLoading,
      isError: teamMembersError,
    },
  } = useTeamMembers();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');

  const isError = teamMembersError;

  if (isError) {
    addNotification({
      message: 'Error fetching team member data',
      type: 'error',
    });
  }

  const filteredTeamMembers = (teamMembers || []).filter(
    (teamMember: TeamMember) => {
      const searchFields = [
        teamMember.name,
        teamMember.email,
        teamMember.mobile,
        teamMember.role,
        teamMember.location,
      ];
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const addNewTeamMemberModal = (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          // @ts-expect-error - HTML dialog method
          document.getElementById('addNewTeamMember')!.showModal()
        }
      >
        Add new team member
      </button>

      <Modal customId="addNewTeamMember">
        <NewTeamMemberForm />
      </Modal>
    </>
  );

  if (teamMembersLoading) return <LoadingOverlay />;

  if (teamMembers.length === 0)
    return (
      <div className="flex flex-row items-center justify-between">
        <p>No team members</p>
        <div>{addNewTeamMemberModal}</div>
      </div>
    );

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">Team members</h1>

        <div className="flex flex-row items-center">
          {addNewTeamMemberModal}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, mobile, role or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeamMembers.map((teamMember: TeamMember) => (
          <Link
            key={teamMember.externalId}
            href={`/team-members/${teamMember.externalId}`}
            className="group"
          >
            <TeamMemberCard teamMember={teamMember} />
          </Link>
        ))}
      </div>
    </div>
  );
}
