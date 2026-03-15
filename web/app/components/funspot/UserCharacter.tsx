import { useProfile } from "~/context/ProfileProvider";

export default function UserCharacter() {
  const { profile, profileLoading, profileError } = useProfile();
  const name = profile.name;

  // Get Initials
  const initials = name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className="bg-secondary border border-tertiary rounded-full p-4 shadow-md w-40 h-40 flex flex-col gap-2 justify-center items-center 
    
    "
    >
      <p className="text-xl font-medium text-text">{initials}</p>
      <p className="text-sm text-text2 w-full truncate ... text-center">
        {" "}
        {name}
      </p>
      {/* Profession */}
      <p className="text-xs text-text2  w-full truncate ... text-ellipsis text-pretty text-center">
        {profile.profession || "Creative"}
      </p>
    </div>
  );
}
