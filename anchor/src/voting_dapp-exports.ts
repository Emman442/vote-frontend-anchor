// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingDappIDL from '../target/idl/voting_dapp.json'
import type { VotingDapp } from '../target/types/voting_dapp'

// Re-export the generated IDL and type
export { VotingDapp, VotingDappIDL }

// The programId is imported from the program IDL.
export const VotingDapp_PROGRAM_ID = new PublicKey(VotingDappIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getFlySwapProgram(provider: AnchorProvider, address?: PublicKey) {
    return new Program({ ...VotingDappIDL, address: address ? address.toBase58() : VotingDappIDL.address } as VotingDapp, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getFlyswapProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Counter program on devnet and testnet.
            return new PublicKey("GLqUArUHjD9NrEkYwoPGKNtMcaeBuqBtxbf4SiHuVfVy")
        case 'mainnet-beta':
        default:
            return VotingDapp_PROGRAM_ID
    }
}