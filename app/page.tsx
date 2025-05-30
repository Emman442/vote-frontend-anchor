"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useWallet,
  useConnection,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-hot-toast";
import { VotingDapp, VotingDappIDL } from "@/anchor/src";
import dynamic from "next/dynamic";
import * as anchor from "@coral-xyz/anchor";
import { Vote, Wallet, Plus, Users } from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Page() {
  const { publicKey } = useWallet();
  const [candidateName, setCandidateName] = useState("");
  const [pollId, setPollId] = useState<number>(1);
  // const pollId = React.useMemo(() => new BN(1), []);
  const [message, setMessage] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isinitializingPoll, setIsInitializingPoll] = useState(false);
  const [isCreatingCandidate, setIsCreatingCandidate] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [candidateAccount, setCandidateAccount] = useState([]);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const program = useMemo(() => {
    if (!publicKey || !wallet) return null;
    console.log("wallet.publickey: ", wallet.publicKey.toString());

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    setProvider(provider);

    try {
      return new Program<VotingDapp>(VotingDappIDL, provider);
    } catch (err) {
      console.error("Failed to initialize program:", err);
      return null;
    }
  }, [connection, wallet, publicKey]);

  const pollAddress = useMemo(() => {
    if (!program) return null;

    try {
      const [pollAddr] = PublicKey.findProgramAddressSync(
        [Buffer.from("poll"), new BN(pollId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      return pollAddr;
    } catch (err) {
      console.error("Error finding poll address:", err);
      return null;
    }
  }, [program, pollId]);

  const initializePoll = async () => {
    console.log("Initializing poll");
    if (!program || !pollId) {
      toast.error("Program not initialized or poll ID missing");
      return;
    }

    setIsInitializingPoll(true);
    try {
      const tx = await program.methods
        .initializePoll(
          new BN(pollId),
          new BN(0),
          new BN(1759508293),
          "test-poll",
          "description"
        )
        .rpc();

      setMessage("Poll initialized successfully");
      toast.success("Poll initialized successfully!");
      console.log("Transaction signature:", tx);
    } catch (err) {
      console.error(err);
      setMessage("Error initializing poll");
      toast.error("Error initializing poll");
    } finally {
      setIsInitializingPoll(false);
    }
  };

  const fetchCandidates = async () => {
    if (!program) return;

    try {
      const candidateAccounts = await program.account.candidate.all([]);
      setCandidateAccount(candidateAccounts)

      console.log("Accountttttsssss: ", candidateAccount)

      const candidateNames = candidateAccounts.map(
        (c: any) => c.account.candidateName
      );
  
      setCandidates(candidateNames);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    if (program) {
      fetchCandidates();
    }
  }, [program]);

  const addCandidate = async () => {
    if (!program || !pollAddress || !candidateName.trim()) {
      toast.error("Missing required data");
      return;
    }
    setIsCreatingCandidate(true);
    try {
      const tx = await program.methods
        .initializeCandidate(new BN(pollId), candidateName)
        .accounts({
          pollAccount: pollAddress,
          // Add other required accounts here if needed
        })
        .rpc();

      setMessage(`Candidate '${candidateName}' added successfully`);
      toast.success(`Candidate '${candidateName}' added successfully!`);

      // Add candidate to local state
      setCandidates((prev) => [...prev, candidateName]);
      setCandidateName(""); // Clear input

      console.log("Transaction signature:", tx);
    } catch (err) {
      console.error(err);
      setMessage("Error adding candidate");
      toast.error("Error adding candidate");
    } finally {
      setIsCreatingCandidate(false);
    }
  };

  const voteCandidate = async () => {
    if (!program || !selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }

    setIsVoting(true);
    try {
      const tx = await program.methods
        .vote(new BN(pollId), selectedCandidate)
        .rpc();

      setMessage(`Voted for '${selectedCandidate}' successfully`);
      toast.success(`Voted for '${selectedCandidate}' successfully!`);

      console.log("Transaction signature:", tx);
    } catch (err) {
      console.error(err);
      setMessage("Error casting vote");
      toast.error("Error casting vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>Connect your wallet to vote</p>
        <WalletMultiButton />
      </div>
    );
  }

  console.log("candidate Account", candidateAccount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Vote className="w-12 h-12" />
            Solana Voting DApp
          </h1>
        </div>

        <div className="flex gap-3">
          {/* Wallet Connection */}
          <div className="max-w-md mx-auto mb-8">
            <WalletMultiButton />
          </div>
          <button className="py-3 px-6 rounded-lg transition-all duration-300">
            View Votes
          </button>

          {/* Initialize Poll Button */}
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={initializePoll}
              disabled={isinitializingPoll || !wallet}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {isinitializingPoll ? "Initializing..." : "Initialize Poll"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Candidate Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Create Candidate
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 font-medium mb-2">
                  Poll ID
                </label>
                <input
                  type="number"
                  value={pollId}
                  onChange={(e) => setPollId(parseInt(e.target.value) || 1)}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter poll ID"
                />
              </div>

              <div>
                <label className="block text-blue-200 font-medium mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter candidate name"
                />
              </div>

              <button
                onClick={addCandidate}
                disabled={
                  isCreatingCandidate || !wallet || !candidateName.trim()
                }
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isCreatingCandidate ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Candidate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Vote Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Cast Your Vote</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 font-medium mb-2">
                  Poll ID
                </label>
                <input
                  type="number"
                  value={pollId}
                  onChange={(e) => setPollId(parseInt(e.target.value) || 1)}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter poll ID"
                />
              </div>

              <div>
                <label className="block text-blue-200 font-medium mb-2">
                  Select Candidate
                </label>
                <select
                  value={selectedCandidate}
                  onChange={(e: any) => setSelectedCandidate(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">
                    Choose a candidate...
                  </option>
                  {candidates.map((candidate) => (
                    <option
                      key={candidate}
                      value={candidate}
                      className="bg-gray-800"
                    >
                      {candidate}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={voteCandidate}
                disabled={isVoting || !wallet || !selectedCandidate}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isVoting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Voting...
                  </>
                ) : (
                  <>
                    <Vote className="w-5 h-5" />
                    Submit Vote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {candidateAccount &&
          candidateAccount.map((i: any, index: any) => (
            <div key={index + 1} className="flex gap-2 justify-center">
              <p>{i.account.candidateName}</p>
              <p>{i.account.candidateVotes?.toString() || "0"}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
