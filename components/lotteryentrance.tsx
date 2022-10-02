import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification, CryptoLogos, Widget } from "web3uikit";

interface contractAddressesInterface {
	[key: string]: string[];
}

export const LotteryEntrance = () => {
	const [entranceFee, setEntranceFee] = useState<string>("0");
	const [numPlayers, setNumPlayers] = useState<string>("0");
	const [recentWinner, setRecentWinner] = useState<string>("");

	const addresses: contractAddressesInterface = contractAddresses;
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex!);
	const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

	const dispatch = useNotification();

	const {
		runContractFunction: enterRaffle,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress!,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress!,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress!,
		functionName: "getNumberOfPlayers",
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress!,
		functionName: "getRecentWinner",
		params: {},
	});

	const updateUI = async () => {
		const entranceFeeFromContract = (
			(await getEntranceFee({ onError: (error) => console.log(error) })) as BigNumber
		)?.toString();
		const numPlayersFromContract = (
			(await getNumberOfPlayers({ onError: (error) => console.log(error) })) as BigNumber
		)?.toString();
		const recentWinnerFromContract = (
			await getRecentWinner({ onError: (error) => console.log(error) })
		)?.toString();
		setEntranceFee(entranceFeeFromContract);
		setNumPlayers(numPlayersFromContract);
		setRecentWinner(recentWinnerFromContract!);
	};

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async (tx: ContractTransaction) => {
		await tx.wait(1);
		handleNewNotification();
		updateUI();
	};

	const handleNewNotification = (tx?: ContractTransaction) => {
		dispatch({
			type: "info",
			message: "Transaction Complete!",
			title: "Tx Notification",
			position: "topR",
		});
	};

	return (
		<div className="p-5">
			{raffleAddress ? (
				<div>
					<div className="flex flex-col items-center m-7 gap-2">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={async () => {
								await enterRaffle({
									onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
									onError: (error) =>
										console.log(
											`Enter Raffle error: ${JSON.stringify(error)}`
										),
								});
							}}
							disabled={isLoading || isFetching}
						>
							{isLoading || isFetching ? (
								<div className="animate-spin h-8 w-8 border-b-2 rounded-full" />
							) : (
								<div>Enter Raffle</div>
							)}
						</button>
						<div className="flex flex-row content-center ml-1">
							<p className="font-bold text-lg mr-1">
								Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")}
							</p>
							<CryptoLogos chain="ethereum" size="30px" />
						</div>
					</div>
					<div className="flex flex-row gap-4">
						<Widget title="Players" info={numPlayers} />
						<Widget title="Recent Winner" info={recentWinner} />
					</div>
				</div>
			) : (
				<div>
					{isWeb3Enabled ? "No Raffle Address Detected" : "Connect to your wallet"}
				</div>
			)}
		</div>
	);
};
