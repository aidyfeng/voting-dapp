import { Program } from "@coral-xyz/anchor";
import { Voting } from "@project/anchor";
import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { Connection, PublicKey } from "@solana/web3.js";

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetdata: ActionGetResponse = {
    icon: "https://acleanbake.com/wp-content/uploads/2014/05/How-to-Make-Peanut-Butter-Or-Another-Nut-or-Seed-Butter-10-735x1103.jpg",
    title: "Vote for your favorite type of peanut butter!",
    description: "Vote beween Crunchy and smooth peanut butter",
    label: "Vote",
    links:{
      actions:[{
        href: "/api/vote?candidate=crunchy",
        label: "Vote for Smooth",
        type: "post"
      },{
        href: "/api/vote?candidate=smooth",
        label: "Vote for Crunchy",
        type: "post"
      }]
    }
  };
  return Response.json(actionMetdata,{headers:ACTIONS_CORS_HEADERS});
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if(candidate != "crunchy" && candidate != "smooth"){
    return new Response("Invalid candidate", { status: 400,headers:ACTIONS_CORS_HEADERS });
  }

  const connection = new Connection("http://127.0.0.1:8899");
  const program :Program<Voting> = new Program(Idl,{connection});
  const body:ActionPostRequest = await request.json();

  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", { status: 400,headers:ACTIONS_CORS_HEADERS });
  }



}
