import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingIndicator from "~/components/errors/LoadingIndicator";
import { GET_BALANCE } from "~/graphql/funspotQueries";
import { GRAPHQL_API_URL } from "~/utils/config";
import { useNavigate } from "react-router-dom";
import { useProfile } from "~/context/ProfileProvider";

const BalanceContext = createContext(null);
export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }) => {
  const navigate = useNavigate();
  const { profile, profileLoading, profileError } = useProfile();
  const accountId = profile?._id; // Ensure _id is used

  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalanceData = async () => {
      if (!profile || !accountId) {
        console.warn("[BalanceProvider] Skipping fetch - profile or accountId is missing");
        return;
      }

      console.log("[BalanceProvider] Fetching balance for accountId:", accountId);
      setLoadingBalance(true);

      try {
        const response = await fetch(GRAPHQL_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: GET_BALANCE,
            variables: { accountId },
          }),
        });

        console.log("[BalanceProvider] Response status:", response.status);

        const json = await response.json();
        console.log("[BalanceProvider] Raw response JSON:", json);

        if (json.errors?.length) {
          throw new Error(json.errors.map((e) => e.message).join(", "));
        }

        const balanceData = json.data?.getBalanceByAccountId || null;
        console.log("[BalanceProvider] Extracted balance data:", balanceData);

        setBalance(balanceData);
      } catch (err) {
        console.error("[BalanceProvider] Error fetching balance:", err);
        setError(err);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalanceData();
  }, [profile, accountId]);

  if (profileLoading || loadingBalance) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (profileError || error) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <p className="text-center text-lg text-red-500">
          Error: {profileError?.message || error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <BalanceContext.Provider value={{ balance, loadingBalance, error }}>
      {children}
    </BalanceContext.Provider>
  );
};
