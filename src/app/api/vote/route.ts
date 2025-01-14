import { ActionGetResponse } from "@solana/actions";

export async function GET(request: Request) {
  const actionMetdata: ActionGetResponse = {
    icon: "https://acleanbake.com/wp-content/uploads/2014/05/How-to-Make-Peanut-Butter-Or-Another-Nut-or-Seed-Butter-10-735x1103.jpg",
    title: "Vote for your favorite type of peanut butter!",
    description: "Vote beween Crunchy and smooth peanut butter",
    label: "Vote",
  };
  return Response.json(actionMetdata);
}
