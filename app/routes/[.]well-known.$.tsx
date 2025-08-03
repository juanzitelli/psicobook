import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Handle Chrome DevTools specific request
  if (url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
    return {};
  }

  // Return 404 for other .well-known requests you don't want to handle
  throw new Response("Not Found", { status: 404 });
}
