'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import Modal from '@/components/UI/Modal';
import Link from 'next/link';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import { useNotifications } from '@/context/notificationsContext';
import UpdateTeamMemberForm from '@/components/Forms/UpdateTeamMemberForm';
import UploadTeamMemberAvatar from '@/components/Forms/UploadTeamMemberAvatar';
import TeamMemberDetailsCard from '@/components/Cards/TeamMemberDetailsCard';

export default function SingleOrderPage() {
  const { teamMemberId } = useParams();
  const { fetchSingleTeamMember, singleTeamMember, deleteTeamMember } =
    useTeamMembers();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!teamMemberId) return;

    fetchSingleTeamMember(teamMemberId as string, {
      onSuccess: () => setLoading(false),
      onError: () => {
        addNotification({
          message: 'Error fetching team member data. Please try again.',
          type: 'error',
        });
        setLoading(false);
      },
    });
  }, [teamMemberId]);

  const handleDeleteTeamMember = async () => {
    if (!teamMemberId) return;

    try {
      await deleteTeamMember.mutateAsync(teamMemberId as string);
      addNotification({
        message: 'Team member deleted successfully',
        type: 'success',
      });
    } catch (error) {
      if (error) {
        addNotification({
          message: 'Error deleting team member. Please try again.',
          type: 'error',
        });
      }
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!singleTeamMember) return <div>Team member not found</div>;

  return (
    <div className="p-6">
      <Link href="/team-members" className="my-4 btn">
        Back
      </Link>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{singleTeamMember.teamMember.name}</h1>
        <div className="flex flex-row items-start justify-evenly">
          <>
            <button
              className="btn btn-primary mr-2"
              onClick={() =>
                // @ts-expect-error - HTML dialog method
                document.getElementById('sendMessageToTeamMember')!.showModal()
              }
            >
              Send team member a message
            </button>

            <Modal customId="sendMessageToTeamMember">
              <div>Send message form</div>
            </Modal>
          </>
          <>
            <button
              className="btn btn-secondary mx-2"
              onClick={() =>
                // @ts-expect-error - HTML dialog method
                document.getElementById('updateTeamMember')!.showModal()
              }
            >
              Update team member details
            </button>

            <Modal customId="updateTeamMember">
              <UpdateTeamMemberForm
                singleTeamMember={singleTeamMember.teamMember}
              />
            </Modal>
          </>
          <>
            <button
              className="btn btn-accent mx-2"
              onClick={() =>
                // @ts-expect-error - HTML dialog method
                document.getElementById('uploadTeamMemberAvatar')!.showModal()
              }
            >
              Upload team member avatar
            </button>

            <Modal customId="uploadTeamMemberAvatar">
              <UploadTeamMemberAvatar />
            </Modal>
          </>
          <button
            className="btn btn-error ml-2"
            onClick={handleDeleteTeamMember}
          >
            Delete team member
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start">
        <TeamMemberDetailsCard teamMember={singleTeamMember.teamMember} />
      </div>
    </div>
  );
}
