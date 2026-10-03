function authorized(request, env) {
  const auth = request.headers.get("authorization") || "";
  const password = String(env.ADMIN_PASSWORD || "");

  return auth === "Bearer " + password;
}

export async function onRequestGet({ env }) {
  try {
    const result = await env.db
      .prepare("SELECT * FROM products ORDER BY id DESC")
      .all();

    return Response.json(result.results || []);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function onRequestPost({ request, env }) {
  try {

    if (!authorized(request, env)) {
      return Response.json(
        {
          ok: false,
          error: "Unauthorized"
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !String(body.name).trim()) {
      return Response.json(
        {
          ok: false,
          error: "نام محصول الزامی است"
        },
        { status: 400 }
      );
    }

    const name = String(body.name).trim();
    const price = Number(body.price || 0);
    const colors = String(body.colors || "");
    const image = String(body.image || "");
    const description = String(body.description || "");

    const result = await env.db
      .prepare(`
        INSERT INTO products
        (name, price, colors, image, description)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        name,
        price,
        colors,
        image,
        description
      )
      .run();

    return Response.json({
      ok: true,
      id: result.meta?.last_row_id
    });

  } catch (error) {

    return Response.json(
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );

  }
}
