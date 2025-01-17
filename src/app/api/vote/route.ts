import { Program } from "@coral-xyz/anchor";
import { Voting, VotingIDL } from "@project/anchor";
import {
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { BN } from "bn.js";

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetdata: ActionGetResponse = {
    icon: "https://acleanbake.com/wp-content/uploads/2014/05/How-to-Make-Peanut-Butter-Or-Another-Nut-or-Seed-Butter-10-735x1103.jpg",
    title: "Vote for your favorite type of peanut butter!",
    description: "Vote beween Crunchy and smooth peanut butter",
    label: "Vote",
    links: {
      actions: [
        {
          href: "/api/vote?candidate=Crunchy",
          label: "Vote for Crunchy",
          type: "post",
        },
        {
          href: "/api/vote?candidate=Smooth",
          label: "Vote for Smooth",
          type: "post",
        },
      ],
    },
  };
  return Response.json(actionMetdata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if (candidate != "Crunchy" && candidate != "Smooth") {
    return new Response("Invalid candidate", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const connection = new Connection("http://127.0.0.1:8899");
  const program: Program<Voting> = new Program(VotingIDL as Voting, {
    connection,
  });
  const body: ActionPostRequest = await request.json();

  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const instruction = await program.methods
    .vote(candidate, new BN(1))
    .accounts({
      signer : voter
    })
    .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const tx = new Transaction({
      feePayer: voter,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(instruction);
    
    const response = await createPostResponse({
      fields:{
        transaction:tx
      }
    });

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
