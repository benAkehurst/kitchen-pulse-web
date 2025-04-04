import { TeamMember } from '@/types/Models';
import Avatar from '../UI/Avatar';

interface TeamMemberDetailsCardProps {
  teamMember: TeamMember;
}

export default function TeamMemberDetailsCard({
  teamMember,
}: TeamMemberDetailsCardProps) {
  const { name, role, mobile, email, location, avatar } = teamMember;

  return (
    <div className="card bg-base-100 shadow-md border border-gray-200 p-6 rounded-2xl w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {avatar ? (
          <Avatar src={avatar} alt={name} size={100} />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-600 mb-2">{role}</p>

          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">Mobile:</span> {mobile}
            </p>
            {email && (
              <p>
                <span className="font-medium">Email:</span> {email}
              </p>
            )}
            {location && (
              <p>
                <span className="font-medium">Location:</span> {location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
