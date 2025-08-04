import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  if (url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
    return {};
  }

  throw new Response("Not Found", { status: 404 });
}
