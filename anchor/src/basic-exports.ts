// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import VotingIDL from '../target/idl/voting.json'
import type { Voting } from '../target/types/voting'

// Re-export the generated IDL and type
export { Voting, VotingIDL as BasicIDL }

// The programId is imported from the program IDL.
export const BASIC_PROGRAM_ID = new PublicKey(VotingIDL.address)

// This is a helper function to get the Basic Anchor program.
export function getBasicProgram(provider: AnchorProvider) {
  return new Program(VotingIDL, provider)
}