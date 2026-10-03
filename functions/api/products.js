function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

function authorized(request, env) {
  const auth = request.headers.get("authorization") || "";
  return auth === "Bearer " + String(env.ADMIN_PASSWORD || "");
}

export async function onRequestGet({ env }) {
  try {
    const result = await env.db
      .prepare("SELECT * FROM products ORDER BY id DESC")
      .all();

    return json(result.results || []);
  } catch (error) {
    return json(
      {
        ok: false,
        error: error.message
      },
      500
    );
  }
}

export async function onRequestPost({ request, env }) {
  try {

    if (!authorized(request, env)) {
      return json(
        {
          ok: false,
          error: "Unauthorized"
        },
        401
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();

    if (!name) {
      return json(
        {
          ok: false,
          error: "نام محصول الزامی است"
        },
        400
      );
    }

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

    return json({
      ok: true,
      id: result.meta?.last_row_id
    });

  } catch (error) {

    return json(
      {
        ok: false,
        error: error.message
      },
      500
    );

  }
}
