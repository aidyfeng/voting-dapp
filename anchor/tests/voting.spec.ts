import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Voting } from "anchor/target/types/voting";
import { BN, Program } from "@coral-xyz/anchor";


const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey(
  "6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF"
);

describe("voting", () => {

  let context;
  let provider;
  let votingProgram : Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "voting", programId: votingAddress }],
      []
    );

    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );
  });

  it("Initialize Poll", async () => {

    await votingProgram.methods.initializePoll(
      new BN(1),
      "What is your favorite type of peanut butter?",
      new BN(0),
      new BN(1836642973)
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer,"le",8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });

  it("Initialize Candidate", async () => {

  });
});
