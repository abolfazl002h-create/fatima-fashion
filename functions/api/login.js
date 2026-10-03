export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const password = String(body?.password ?? "");
    const expected = String(context.env.ADMIN_PASSWORD ?? "");

    if (!expected) {
      return Response.json(
        {
          ok: false,
          error: "ADMIN_PASSWORD در Cloudflare تنظیم نشده است."
        },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return Response.json(
        {
          ok: false,
          error: "رمز ورود نادرست است"
        },
        { status: 401 }
      );
    }

    return Response.json({
      ok: true,
      token: expected
    });

  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "خطا در پردازش درخواست ورود"
      },
      { status: 400 }
    );
  }
}
