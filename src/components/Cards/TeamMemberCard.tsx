import { SingleTeamMember } from '@/types/Models';
import Avatar from '../UI/Avatar';

interface TeamMemberCardProps {
  teamMember: SingleTeamMember;
}

export default function TeamMemberCard({ teamMember }: TeamMemberCardProps) {
  const { name, role, mobile, email, location, avatar } = teamMember;

  return (
    <div className="card bg-base-100 shadow-md border border-gray-200 p-4 rounded-2xl hover:shadow-lg transition">
      <div className="flex flex-col items-center text-center">
        {avatar ? (
          <Avatar src={avatar} alt={name} size={80} />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-sm text-gray-600">{role}</p>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
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
  );
}
