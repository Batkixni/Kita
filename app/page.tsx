import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    // @ts-ignore - username is added via config
    if (session.user.username) {
      // @ts-ignore
      redirect(`/${session.user.username}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Kita</h1>
      <p className="text-xl mb-8 text-muted-foreground">Build your personalized bento page.</p>

      <div className="flex gap-4">
        {session ? (
          // @ts-ignore
          <a href={`/${session.user.username}`} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-stone-800 transition">
            Go to my page
          </a>
        ) : (

          <a href="/sign-in" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-stone-800 transition">
            Get Started
          </a>
        )}
      </div>
    </div >
  );
}
