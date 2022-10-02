import { useEffect, useMemo } from "react";
import { useMoralis } from "react-moralis";

export const ManualHeader = () => {
	const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
		useMoralis();

	useEffect(() => {
		if (isWeb3Enabled) return;
		if (typeof window !== "undefined") {
			if (window.localStorage.getItem("connected")) {
				enableWeb3();
			}
		}
	}, [isWeb3Enabled]);

	Moralis.onAccountChanged((account) => {
		if (account == null) {
			window.localStorage.removeItem("connected");
			deactivateWeb3();
		}
	});

	const formattedAccount = !!account
		? `${account.slice(0, 6)}...${account.slice(account.length - 4)}`
		: "";

	return (
		<div>
			{!!account ? (
				<div>Connected to {formattedAccount}</div>
			) : (
				<button
					onClick={async () => {
						await enableWeb3();
						if (typeof window !== "undefined") {
							window.localStorage.setItem("connected", "injected");
						}
					}}
					disabled={isWeb3EnableLoading}
				>
					Connect
				</button>
			)}
		</div>
	);
};
