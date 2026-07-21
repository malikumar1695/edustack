import { NextRequest, NextResponse } from "next/server";

const SERVICES: Record<string, string | undefined> = {
  auth: process.env.AUTH_SERVICE_URL,
  academic: process.env.ACADEMIC_SERVICE_URL,
  notifications: process.env.NOTIFICATION_SERVICE_URL,
};

async function proxy(
  req: NextRequest,
  { params }: { params: { service: string; path: string[] } },
) {
  const base = SERVICES[params.service];
  if (!base) {
    return NextResponse.json(
      { error: `Unknown service "${params.service}"` },
      { status: 404 },
    );
  }

  const targetUrl = `${base}/${params.path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  // Single place auth gets attached — every service trusts this token,
  // the browser never sees it and never talks to the services directly.
  const token = req.cookies.get("ilm_token")?.value;
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(req.method);

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? await req.text() : undefined,
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
