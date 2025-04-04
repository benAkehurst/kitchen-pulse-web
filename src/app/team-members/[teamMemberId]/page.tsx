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
import { Message } from '@/types/Models';

export default function SingleOrderPage() {
  const { teamMemberId } = useParams();
  const { fetchSingleTeamMember, singleTeamMember, deleteTeamMember } =
    useTeamMembers();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('dateDesc');

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

  const filteredMessages =
    singleTeamMember.messages &&
    singleTeamMember.messages.sort((a: Message, b: Message) => {
      const dateA = new Date(a.sendOnDate).getTime() || 0;
      const dateB = new Date(b.sendOnDate).getTime() || 0;

      if (sortOption === 'dateDesc') return dateB - dateA;
      if (sortOption === 'dateAsc') return dateA - dateB;

      return 0;
    });

  if (loading) return <LoadingOverlay />;
  if (!singleTeamMember) return <div>Team member not found</div>;

  return (
    <div className="p-6">
      <Link href="/team-members" className="my-4 btn">
        Back
      </Link>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl mb-4">{singleTeamMember.teamMember.name}</h1>
      </div>
      <div className="flex flex-row items-start justify-evenly my-4">
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
        <button className="btn btn-error ml-2" onClick={handleDeleteTeamMember}>
          Delete team member
        </button>
      </div>

      <div className="flex flex-col items-start justify-start my-8">
        <TeamMemberDetailsCard teamMember={singleTeamMember.teamMember} />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      {singleTeamMember.messages.length === 0 ? (
        <p>No messages found for team member.</p>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="flex gap-4 mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="select select-bordered"
            >
              <option value="dateDesc">Date: Newest First</option>
              <option value="dateAsc">Date: Oldest First</option>
            </select>
          </div>
          <ul className="space-y-4">
            {filteredMessages.map((message: Message) => (
              <li
                key={message.externalId}
                className="p-4 border rounded-lg shadow-sm"
              >
                <Link
                  href={`/message/${message.externalId}`}
                  className="text-blue-600 hover:underline"
                >
                  <p>
                    <strong>Message Contents:</strong> {message.messageContents}
                  </p>
                  <p>
                    <strong>Message Date:</strong>{' '}
                    {new Date(message.createdAt!).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
