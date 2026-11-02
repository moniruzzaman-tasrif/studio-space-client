// path to your Better Auth server instance
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


const DetelsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  const res = await fetch(`http://localhost:5000/studios/${slug}`);
  const data = await res.json()
  console.log(data)

  return <div></div>;
};

export default DetelsPage;
