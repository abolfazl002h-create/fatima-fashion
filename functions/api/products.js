function authorized(request, env) {
  const h = request.headers.get("authorization") || "";
  return h === "Bearer " + String(env.ADMIN_PASSWORD || "");
}

export async function onRequestGet({ env }) {
  const { results = [] } =
    await env.db
      .prepare("SELECT * FROM products ORDER BY id DESC")
      .all();

  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const b = await request.json().catch(() => ({}));

  if (!b.name) {
    return Response.json(
      { error: "نام محصول الزامی است" },
      { status: 400 }
    );
  }

  const r = await env.db
    .prepare(
      "INSERT INTO products (name,price,colors,image,description) VALUES (?,?,?,?,?)"
    )
    .bind(
      String(b.name),
      Number(b.price || 0),
      String(b.colors || ""),
      String(b.image || ""),
      String(b.description || "")
    )
    .run();

  return Response.json({
    ok: true,
    id: r.meta?.last_row_id
  });
}
