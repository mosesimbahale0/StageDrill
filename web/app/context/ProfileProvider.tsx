import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import LoadingIndicator from "~/components/errors/LoadingIndicator";
import { GET_PROFILE } from "~/graphql/funspotQueries";
import { GRAPHQL_API_URL } from "~/utils/config";
import { useAuth } from "~/authContext";
import { useNavigate } from "react-router-dom";

const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Fetch profile only when needed
  const fetchProfileData = useCallback(async () => {
    if (!user || profileFetched) return; // Prevent redundant fetching

    setLoadingProfile(true);
    try {
      const response = await fetch(GRAPHQL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_PROFILE,
          variables: { uid: user.uid },
        }),
      });

      const json = await response.json();
      if (json.errors?.length) {
        throw new Error(json.errors.map((e) => e.message).join(", "));
      }

      // Batch updates to minimize re-renders
      setProfile((prev) => ({
        ...prev,
        ...(json.data?.getCustomerByUid ?? null),
      }));
      setProfileFetched(true);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err);
    } finally {
      setLoadingProfile(false);
    }
  }, [user, profileFetched]);

  useEffect(() => {
    if (!authLoading && user) fetchProfileData();
  }, [authLoading, user, fetchProfileData]);

  // Navigate to onboarding if profile is missing
  useEffect(() => {
    if (
      !authLoading &&
      !loadingProfile &&
      profileFetched &&
      profile === null &&
      user
    ) {
      console.log("Navigating to /onboarding after 2s delay");
      const timeoutId = setTimeout(() => {
        navigate("/onboarding");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [profile, loadingProfile, authLoading, navigate, user, profileFetched]);

  // Debugging logs (Remove in production)
  useEffect(() => {
    console.table({
      user,
      profile,
      loadingProfile,
      authLoading,
      error,
      profileFetched,
    });
  }, [user, profile, loadingProfile, authLoading, error, profileFetched]);

  // Show loading indicator if still loading
  if (authLoading || loadingProfile) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};


