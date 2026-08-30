type RequestAddress = {
  protocol?: string;
  headers: Record<string, string | string[] | undefined>;
};

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function getApplicationUrl(request: RequestAddress) {
  const origin = firstHeader(request.headers.origin);
  if (origin?.startsWith("http")) return origin.replace(/\/$/, "");

  const host = firstHeader(request.headers["x-forwarded-host"]) ?? firstHeader(request.headers.host);
  if (!host) throw new Error("Não foi possível identificar o domínio da aplicação.");

  const protocol = firstHeader(request.headers["x-forwarded-proto"]) ?? request.protocol ?? "https";
  return `${protocol}://${host}`.replace(/\/$/, "");
}
