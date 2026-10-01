FATIMA ADMIN SITE
1) Create a Cloudflare D1 database.
2) Create Pages Functions deployment via Git integration or Wrangler. Direct Upload is not supported when using Pages Functions.
3) Bind D1 as DB under Workers & Pages > project > Settings > Bindings > D1.
4) Add a secret/environment variable named ADMIN_PASSWORD containing your private admin password.
5) Apply schema.sql to D1.
6) Deploy. Public site: /  Admin: /admin.html
Important: this starter stores image URLs, not image files. Use a public image URL or later add R2 upload.
