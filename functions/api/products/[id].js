function authorized(request, env) {
  const h = request.headers.get("authorization") || "";
  return h === "Bearer " + String(env.ADMIN_PASSWORD || "");
}

export async function onRequestDelete({ request, env, params }) {
  if (!authorized(request, env)) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await env.db
    .prepare("DELETE FROM products WHERE id = ?")
    .bind(Number(params.id))
    .run();

  return Response.json({ ok: true });
}
