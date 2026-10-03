function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

export async function onRequestPost(context) {
  try {

    const body = await context.request.json();

    const password = String(body?.password ?? "");
    const expected = String(context.env.ADMIN_PASSWORD ?? "");

    if (!expected) {
      return json(
        {
          ok: false,
          error: "ADMIN_PASSWORD تنظیم نشده است."
        },
        500
      );
    }

    if (password !== expected) {
      return json(
        {
          ok: false,
          error: "رمز ورود نادرست است"
        },
        401
      );
    }

    return json({
      ok: true,
      token: expected
    });

  } catch (error) {

    return json(
      {
        ok: false,
        error: "خطا در پردازش درخواست ورود"
      },
      400
    );

  }
}
